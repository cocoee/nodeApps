
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
    logger.log('info', 'Get all HelpTickets');
    let query = HelpTicket.find();
    query.sort(req.query.order)

    .populate({path: 'personId', model: 'User', select: 'lastName firstName fullName'} )
    .populate({path: 'ownerId', model: 'User', select: 'lastName firstName fullName'} );


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
    let query = HelpTicket.find();
    query.sort(req.query.order)

    .populate({path: 'personId', model: 'User', select: 'lastName firstName fullName'} )
    .populate({path: 'ownerId', model: 'User', select: 'lastName firstName fullName'} );

    await HelpTicket.findById(req.params.id).then(result => {
        res.status(200).json(result);
    })
}));

router.post('/helpTickets', asyncHandler(async (req, res) => {
    logger.log('info', 'Creating HelpTicket');
    var helpTicket = new HelpTicket(req.body.helpTicket);
    await helpTicket.save()
        .then(result => {
            req.body.content.helpTicketId = result._id;
                var helpTicketContent = new HelpTicketContent(req.body.content);
                helpTicketContent.save()
                    .then(content => {
            res.status(201).json(result);
                })
        })
}));

router.put('/helpTickets', asyncHandler(async (req, res) => {
    logger.log('info', 'Updating HelpTicket');
    await HelpTicket.findOneAndUpdate({ _id: req.body.helpTicket._id }, req.body.helpTicket, { new: true })
        .then(result => {
            if (req.body.content) {
                req.body.content.helpTicketId = result._id;
                var helpTicketContent = new HelpTicketContent(req.body.content);
                helpTicketContent.save()
                    .then(content => {
                        res.status(201).json(result);
                    })
            } else {
            res.status(200).json(result);
            }
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
    logger.log('info', 'Getting all HelpTicket Contents');
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
     
// router.post('/helpTicketContents', asyncHandler(async (req, res) => {
//     logger.log('info', ' Upload a file for a specific HelpTicket Content');
//     await HelpTicketCotent.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
//         .then(result => {
//             res.status(200).json(result);
//         })
// }));


router.put('/helpTicketContents', asyncHandler(async (req, res) => {
    logger.log('info', 'Updating HelpTicket Content');
    await HelpTicketCotent.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
        .then(result => {
            res.status(200).json(result);
        })
}));

router.delete('/helpTicketContents/:id', asyncHandler(async (req, res) => {
    logger.log('info', 'Deleting HelpTicket Contents %s', req.params.id);
    await HelpTicketContent.remove({ _id: req.params.id })
        .then(result => {
            res.status(200).json(result);
        })
}));

};
