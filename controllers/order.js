const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')


module.exports.getAll = async function(request, response){
    const query = {
        user: request.user.id
    }

    // start date
    if(request.query.start) {
        query.date = {
            $gte: request.query.start
        }
    }
    if(request.query.end) {
        if(!query.date){
            query.date = {}
        }

        query.date['$lte'] = request.query.end
    }

    if(request.query.order) {
        query.order = +request.query.order
    }
    try{
        // note: request example
        // [GET]localhost:5000/api/order?offset=2&limit=5
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+request.query.offset) // +string = number
            .limit(+request.query.limit)

        response.status(200).json(orders)
    } catch(e){
        errorHandler(response, e)
    }
}

module.exports.create = async function(request, response){
    try{
        const lastOrder = await Order
            .findOne({user: request.user.id})
            .sort({date: -1})

        const maxOrder = lastOrder ? lastOrder.order : 0

        const order = await new Order({
            list: request.body.list,
            user: request.user.id,
            order: maxOrder + 1
        }).save()
        response.status(201).json(order)
    } catch(e){
        errorHandler(response, e)
    }
}
