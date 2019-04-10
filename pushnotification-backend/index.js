
const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const addPushSubscriber = require('./addPushSubscriber')
const subscribedUsers = require('./subscriber')
const vapidKeys = {
    "publicKey":"BIE4F8k9vfy3-Xx1kentdyEhvvdonuxfVaCACH9_x-WzkdfRPs-PQ6KqPFlPgnrs0JCoNEQCkkep6VHPOZ31ioE",
    "privateKey":"sRQoQs0RnDQioeKKysmUr6__icSfOXH6sqWDk7Kx6Mg"
}

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
const port = 3000
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.post('/api/notifications',addPushSubscriber)

app.post('/api/newsletter', (req, res) => {
  
    console.log('Total subscriptions', subscribedUsers.length);

    const notificationPayload = {
        "notification": {
            "title": "Angular News",
            "body": "Newsletter Available!",
            "icon": "assets/main-page-logo-small-hat.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    };

    Promise.all(subscribedUsers.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
