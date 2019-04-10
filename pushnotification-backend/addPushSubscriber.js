subscribedUsers =  require('./subscriber')

addPushSubscriber = function(req, res){
    subscribedUsers.push(req.body)
    res.status(200).json({message : "subscription done"})
}

module.exports = addPushSubscriber;