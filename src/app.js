const { App } = require("@slack/bolt");
const axios = require("axios");

require("dotenv").config();

// require the fs module that's built into Node.js
const fs = require('fs')
// get the raw data from the db.json file
let raw = fs.readFileSync('src/db.json');
// parse the raw bytes from the file as JSON
let faqs= JSON.parse(raw);


// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    userAuth: process.env.FM_AUTH,
    socketMode:true, // enable the following to use socket mode
    appToken: process.env.APP_TOKEN
  });



  app.message("!dad", async ({ message, say }) => {

    const getjoke = async () => {
      try {
        const response = await axios.get("https://icanhazdadjoke.com/", {
          headers: {
            Accept: "application/json",
            "User-Agent": "axios 0.21.1"
          }
        });
        say({ text: response.data.joke, thread_ts: message.ts })
      }
      catch (err) {
        console.log("received error: ", err);
      }
    };
    
    getjoke();
      
    });

  app.message(":joy:", async ({ message, say }) => {

      const getjoke = async () => {
        try {
          const response = await axios.get("https://icanhazdadjoke.com/", {
            headers: {
              Accept: "application/json",
              "User-Agent": "axios 0.21.1"
            }
          });
          say({ text: response.data.joke, thread_ts: message.ts })
        }
        catch (err) {
          console.log("received error: ", err);
        }
      };
      
      getjoke();
        
    });

  app.message("!add_hours", async ({message, say }) => {
      
      params = message.text.replace("!add_hours ", "");
      console.log(params);

      let userAuth=process.env.FM_AUTH;

  let options = {
    url: 'https://fm195.beezwax.net/fmi/data/v1/databases/FOCUS_Morgan/sessions',
    method: "POST",
    headers: {
      'Authorization' : userAuth,
      'Content-Type' : 'application/json',
    }
  };

  let token = axios.request(options)
    .then(function (response) {
        bearerToken = response.data.response.token;
      return bearerToken;
    })
    .then(function(bearerToken){
      token=bearerToken;
      let options2 = {
        url: 'https://fm195.beezwax.net/fmi/data/v1/databases/FOCUS_Morgan/layouts/dapi_layout/script/add-hour?script.param='+params,
        method: "GET",
        headers: {
          'Authorization' : 'Bearer ' + token,
          'Content-Type' : 'application/json'
        }
      };
      return options2;
    })
    .then(function(options2){
      axios.request(options2)    
    })
    .catch(function (error) {
        console.error(error);
    });

  });

  app.message("!hours", async ({ message, say }) => {
    let userAuth=process.env.FM_AUTH;

    if (message.channel == 'D04528EHW7R'){
      fmroute = "dm";
    } else fmroute = "channel";

    let options = {
      url: 'https://fm195.beezwax.net/fmi/data/v1/databases/FOCUS_Morgan/sessions',
      method: "POST",
      headers: {
        'Authorization' : userAuth,
        'Content-Type' : 'application/json',
      }
    };

    let token = axios.request(options)
      .then(function (response) {
          bearerToken = response.data.response.token;
        return bearerToken;
      })
      .then(function(bearerToken){
        token=bearerToken;
        let options2 = {
          url: 'https://fm195.beezwax.net/fmi/data/v1/databases/FOCUS_Morgan/layouts/dapi_layout/script/billed-hours-' + fmroute,
          method: "GET",
          headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
          }
        };
        return options2;
      })
      .then(function(options2){
        axios.request(options2)    
      })
      .catch(function (error) {
          console.error(error);
      });
    
    }); 


  app.message("!say_hello", async ({ command, say }) => {    
    let userAuth = process.env.FM_AUTH;


  let options = {
    url: 'https://fm195.beezwax.net/fmi/data/v1/databases/FOCUS_Morgan/sessions',
    method: "POST",
    headers: {
      'Authorization' : userAuth,
      'Content-Type' : 'application/json',
    }
  };

let token = axios.request(options)
      .then(function (response) {
          bearerToken = response.data.response.token;
        return bearerToken;
      })
      .then(function(bearerToken){
        token=bearerToken;
        let options2 = {
           url: 'https://fm195.beezwax.net/fmi/data/v1/databases/FOCUS_Morgan/layouts/dapi_layout/script/POST-to-Slack',
          method: "GET",
          headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
          }
        };
        return options2;
      })
      .then(function(options2){
        axios.request(options2)    
      })
      .catch(function (error) {
          console.error(error);
      });

  
/*
  let token = axios.request(options)
    .then(function (response) {
        bearerToken = response.data.response.token;
      return bearerToken;
    })
    .then(function(bearerToken){
      token=bearerToken;
      let options2 = {
        url: 'https://fm195.beezwax.net/fmi/data/v1/databases/FOCUS_Morgan/layouts/dapi_layout/script/POST-to_Slack',
        method: "GET",
        headers: {
          'Authorization' : 'Bearer ' + token,
          'Content-Type' : 'application/json'
        }
        
    };
    return options2;
  })
  .then(function(options2){
    axios.request(options2)
  })
      .catch(function (error) {
        console.error(error);
        });

        */
    });

  app.command("/knowledge", async ({ command, ack, say }) => {
      try {
        await ack();
        let message = { blocks: [] };
        faqs.data.map((faq) => {
          message.blocks.push(
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Question*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: faq.question,
              },
            },
            {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Answer*",
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: faq.answer,
                },
              }
          );
        });
        say(message);
      } catch (error) {
        console.log("err");
        console.error(error);
      }
    });

  app.message(/products/, async ({ command, say }) => {
    try {
      let message = { blocks: [] };
      const productsFAQs = faqs.data.filter((faq) => faq.keyword === "products");
  
      productsFAQs.map((faq) => {
        message.blocks.push(
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Question ❓*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.question,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Answer ✔️*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.answer,
            },
          }
        );
      });
  
      say(message);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
    });

  app.message(/people/, async ({ command, say }) => {
    try {
      let message = { blocks: [] };
      const productsFAQs = faqs.data.filter((faq) => faq.keyword === "people");
  
      productsFAQs.map((faq) => {
        message.blocks.push(
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Question ❓*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.question,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Answer ✔️*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.answer,
            },
          }
        );
      });
  
      say(message);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
    });

  app.message("hey b", async ({ command, say }) => {
    try {

      say("Hey my friend!!!");
    } catch (error) {
      console.log("err");
      console.error(error);
    }
    });


  app.message("thanks beebot", async ({ command, say }) => {
    try {

      say("No thank you!!!");
    } catch (error) {
      console.log("err");
      console.error(error);
    }
    });

  app.message("!delete", async ({ message, client }) => {
      const channelId = message.channel;
      const messageId = message.thread_ts;

      try {
        const result = await client.chat.delete({
          channel: channelId,
          ts: messageId
        });
      }
      catch (error) {
        console.error(error);
      }
    });
  

  app.command("/update", async ({ command, ack, say }) => {
    try {
      await ack();
      const data = command.text.split("|");
      const newFAQ = {
        keyword: data[0].trim(),
        question: data[1].trim(),
        answer: data[2].trim(),
      };
      // save data to db.json
      fs.readFile("db.json", function (err, data) {
        const json = JSON.parse(data);
        json.data.push(newFAQ);
        fs.writeFile("db.json", JSON.stringify(json), function (err) {
          if (err) throw err;
          console.log("Successfully saved to db.json!");
        });
    });
    say(`You've added a new FAQ with the keyword *${newFAQ.keyword}.*`);
  } catch (error) {
    console.log("err");
    console.error(error);
  }

    });

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();