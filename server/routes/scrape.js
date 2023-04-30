const express = require('express');
const router = express.Router();
const request = require('request-promise');
const cheerio = require('cheerio');
var himalaya = require('himalaya');
const sanitizeHtml = require('sanitize-html');
const cloudflareScraper = require('cloudflare-scraper');



router.post('/site', async (req, res) => {
    try {
        await request(req.body.scrapeUrl, async (err, resp, html) => {
            if (!err && resp.statusCode == 200) {
                try {
                    // res.send(html);
                    await scrapeSite(req.body, html, res)
                } catch (error) {
                    // console.log(error);
                    res.status(404).send({ err: "error" });
                }
            }
            else {
                if (html) {
                    try {
                        // await scrapeSite(req.body, html, res);
                        res.status(404).send({ err: "Capthca detected" });

                    } catch (error) {
                        res.status(404).send({ err: "Error" });
                    }
                } else {
                    res.status(404).send({ err: "Error In Recieving Response" });
                }
            }
        });

        // const response = await cloudflareScraper.get(req.body.scrapeUrl);
        // const response = await cloudflareScraper.get('https://cloudflare-url.com');

        // console.log(response);


    } catch (error) {
        console.log(error)
        // res.status(404).send({ err: "Error In Recieving Response" });
    }
});

async function scrapeSite(body, html, res) {
    const $ = cheerio.load(html);
    let json = [];
    $(body.section.class).each(async (i, data1) => {
        const parentHtmlString = sanitize($, data1)

        var extractedValue = (await himalaya.parse(parentHtmlString))[0];

        const totalDetails = {};
        // console.log("body", body.section.img);
        if (body.section.img) {
            // console.log("body 1", body.section.img);
            totalDetails.img = extractImgSrc(parentHtmlString);
        }
        totalDetails[extractedValue.attributes[0].key] = extractedValue.attributes[0].value;
        const $$ = cheerio.load(data1);

        body.section.children && Object.keys(body.section.children).forEach(async child => {
            $$(child).each(async (i, data) => {
                const childHtmlString = sanitize($$, data)
                // console.log(item1);
                if (body.restype && body.restype == "htmlString") {
                    json += childHtmlString;
                    return;
                }
                if (body.html) {
                    totalDetails[body.section.children[body.section.children[child]]] = (childHtmlString.content);
                    return;
                }
                var extractedValueArr = await himalaya.parse(childHtmlString);
                // console.log("ajson" , extractedValueArr , "---")
                totalDetails[body.section.children[child]] = (extractedValueArr && extractedValueArr[0]?.content) || null;
            });
            json.push(totalDetails)
        });

    })

    setTimeout(async () => {
        await res.status(200).send({ data: json });
        // await res.status(200).send(json);
    }, 100);
}

function sanitize($, data) {
    return sanitizeHtml($(data).html(), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['a', 'h3', 'b', 'span', 'img']),
        allowedAttributes: {
            h3: [],
            b: [],
            span: [],
            a: ['href'],
            img: ['src'],
            // We don't currently allow img itself by default, but
            // these attributes would make sense if we did.
            // img: ['src', 'srcset', 'alt', 'title', 'loading', 'data-src'],
            '*': ['href', 'src']
        }
    }).replace(/(\r\n|\n|\r)/gm, "");
}

function extractImgSrc(htmlString) {
    const imgSrcs = [];
    // console.log(htmlString, imgSrcs);
    const regex = /<img[^>]+src="?([^"\s]+)"?\s*\/?>/g;
    let match;

    while ((match = regex.exec(htmlString)) !== null) {
        imgSrcs.push(match[1]);
    }


    return imgSrcs;
}



module.exports = router