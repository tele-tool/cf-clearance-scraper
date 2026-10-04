function solveTurnstileMax({ url, proxy, cookies }) {
    return new Promise(async (resolve, reject) => {

        if (!url) return reject('Missing url parameter')

        // Chrome normalizes "https://host" to "https://host/", so the intercept pattern must use the normalized form
        url = new URL(url).href

        const context = await global.browser.createBrowserContext().catch(() => null);

        if (!context) return reject('Failed to create browser context')

        let isResolved = false
        const { proxyRequest } = await import('puppeteer-proxy')
        const { RequestInterceptionManager } = await import('puppeteer-intercept-and-modify-requests')

        var cl = setTimeout(async () => {
            if (!isResolved) {
                await context.close()
                reject("Timeout Error")
            }
        }, (global.timeOut || 60000))

        try {
            const page = await context.newPage();

            const client = await page.target().createCDPSession()
            const interceptManager = new RequestInterceptionManager(client)

            await page.setRequestInterception(true);
            let p = process.env.PROXY
            // if (p) {
            //     p = p.split(":")
            //     proxy = {
            //         host: p[0],
            //         port: p[1],
            //         username: p[2],
            //         password: p[3],
            //     }
            // }
            // console.log(proxy)
            page.on('request', async (request) => {
                try {
                    if (proxy) {
                        await proxyRequest({
                            page,
                            proxyUrl: `http://${proxy.username ? `${proxy.username}:${proxy.password}@` : ""}${proxy.host}:${proxy.port}`,
                            request,
                        });
                    } else {
                        request.continue()
                    }
                } catch (e) { }
            });

            await interceptManager.intercept(
                {
                    urlPattern: url,
                    resourceType: 'Document',
                    modifyResponse({ body }) {
                        return {
                            body: String(body).replace('</body>', String(require('fs').readFileSync('./src/data/callback.html')) + '</body>')
                        }
                    },
                }
            )
            if (cookies) {
                const hostname = new URL(url).hostname
                // Accept either "a=1; b=2" or [{ name, value, domain?, path? }]
                const list = typeof cookies === 'string'
                    ? cookies.split(';').map(c => c.trim()).filter(Boolean).map(c => {
                        const i = c.indexOf('=')
                        return { name: c.slice(0, i).trim(), value: c.slice(i + 1).trim() }
                    })
                    : cookies
                await page.setCookie(...list.map(c => ({ domain: hostname, path: '/', ...c })))
            }
            await page.goto(url, {
                waitUntil: 'domcontentloaded'
            })

            await page.waitForSelector('[name="cf-response"]', {
                timeout: 60000
            })
            const token = await page.evaluate(() => {
                try {
                    return document.querySelector('[name="cf-response"]').value
                } catch (e) {
                    return null
                }
            })
            isResolved = true
            clearInterval(cl)
            await context.close()
            if (!token || token.length < 10) return reject('Failed to get token')
            return resolve(token)
        } catch (e) {
            if (!isResolved) {
                await context.close()
                clearInterval(cl)
                reject(e.message)
            }
        }

    })
}
module.exports = solveTurnstileMax