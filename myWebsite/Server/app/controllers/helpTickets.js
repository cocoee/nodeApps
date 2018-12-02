
var express = require('express'),
router = express.Router(),
logger = require('../../config/logger'),
mongoose = require('mongoose');
HelpTicket = mongoose.model('HelpTicket');
HelpTicketContent = mongoose.model('HelpTicketContent');
asyncHandler = require('express-async-handler');


module.exports = function (app, config) {
app.use('/api', router);

router.get('/helpTickets', asyncHandler(async (req, res) => {
    logger.log('info', 'Get all helpTickets');
    let query = HelpTicket.find();

    query.sort(req.query.order)

    if(req.query.status){
        if(req.query.status[0]== '-'){
            query.where('status').ne(req.query.status.substring(1));
        }else{
            query.where('status').eq(req.query.status);
        }
    }
    await query.exec().then(result => {
        res.status(200).json(result);
    })
}));


router.get('/helpTickets/:id', asyncHandler(async (req, res) => {
    logger.log('info', 'Get helpTicket %s', req.params.id);
    await HelpTicket.findById(req.params.id).then(result => {
        res.status(200).json(result);
    })
}));

router.post('/helpTickets', asyncHandler(async (req, res) => {
    logger.log('info', 'Creating helpTicket');
    var helpTicket = new HelpTicket(req.body);
    await helpTicket.save()
        .then(result => {
            res.status(201).json(result);
        })
}));

router.put('/helpTickets', asyncHandler(async (req, res) => {
    logger.log('info', 'Updating helpTicket');
    await HelpTicket.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
        .then(result => {
            res.status(200).json(result);
        })
}));

router.delete('/helpTickets/:id', asyncHandler(async (req, res) => {
    logger.log('info', 'Deleting helpTicket %s', req.params.id);
    await HelpTicket.remove({ _id: req.params.id })
        .then(result => {
            res.status(200).json(result);
        })
}));


router.get('/helpTicketsContents', asyncHandler(async (req, res) => {
    logger.log('info', 'Getting HelpTicket Content');
    let query = HelpTicketContent.find();
    query.sort(req.query.order)
    await query.exec().then(result => {
        res.status(200).json(result);
    })
}));


router.get('/helpTicketContents/helpTicket/:id', asyncHandler(async (req, res) => {
    logger.log('info', 'Getting a HelpTicketContent');
    let query = HelpTicketContent.find({helpTicketId: req.params.id});
    await query.exec().then(result => {
        res.status(200).json(result);
    })
}));

router.post('/helpTicketContents', asyncHandler(async (req, res) => {
    logger.log('info', 'Creating HelpTicket Content');
    var helpTicketContent = new HelpTicketContent(req.body);
    const result=await helpTicketContent.save()
            res.status(201).json(result);
}));

// router.put('/helpTickets', asyncHandler(async (req, res) => {
//     logger.log('info', 'Updating helpTicket');
//     await HelpTicket.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
//         .then(result => {
//             res.status(200).json(result);
//         })
// }));

// router.delete('/helpTickets/:id', asyncHandler(async (req, res) => {
//     logger.log('info', 'Deleting helpTicket %s', req.params.id);
//     await HelpTicket.remove({ _id: req.params.id })
//         .then(result => {
//             res.status(200).json(result);
//         })
// }));

};

