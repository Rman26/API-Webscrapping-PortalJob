const express = require('express');
const app = express();
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

app.use(express.json())
app.use(cors());
const port =2134;

app.get('/',(req,res)=>{
    let url = 'https://www.portaljob-madagascar.com/emploi/liste/';
    axios.get(url).then(({data})=>{
        const $ = cheerio.load(data);
        let list = [];
        $('.item_annonce').each((k,element)=>{
            const titleValues= $(element).find('h3').text();
            const descriptionValues = $(element).find('a').text();
            const boiteName = $(element).find('h4').text();
            list.push({
                title : titleValues,
                description : descriptionValues,
                boite : boiteName
            })
        })
        res.send(list)
    });
})


app.get('/:page', async (req,res)=>{
    const {page} = req.params;
    await axios('https://www.portaljob-madagascar.com/emploi/liste/page/'+page).then(({data})=>{
        let list = [];
        const $ = cheerio.load(data);
        $('.item_annonce').each((k,element)=>{
            const titleValues= $(element).find("h3").text();
            const descriptionValues = $(element).find('a').text().trim();
            const boiteName = $(element).find('h4').text();
            list.push({
                title : titleValues,
                description : descriptionValues,
                boite : boiteName
            })
        })
        res.send(list)
    })
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

