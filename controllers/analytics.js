const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function(request, response){
    try{
        const allOrders = await Order.find({user: request.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('MM.DD.YYYY')] || []

        // Number of orders
        const totalOrdersNumber = allOrders.length

        // Number of yesterday orders
        const yesterdayOrdersNumber = yesterdayOrders.length

        // Total number of days
        const daysNumber = Object.keys(ordersMap).length

        // Number of orders per day
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)

        // Percentage for the number of orders
        // ((num_of_orders_yesterday / num_of_orders_per_day) - 1) * 100%
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)

        // Total revenues
        const totalRevenue = calculatePrice(allOrders)

        // Revenue per day
        const revenuePerDay = totalRevenue / daysNumber

        // Yesterday revenue
        const yesterdayRevenue = calculatePrice(yesterdayOrders)

        // Revenue percentage
        // ((yesterday_revenue / revenue_per_day) - 1) * 100%
        const revenuePercent = (((yesterdayRevenue / revenuePerDay) - 1) * 100).toFixed(2)

        // Revenue compare
        const compareRevenue = (yesterdayRevenue - revenuePerDay).toFixed(2)

        // Number of orders compare
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        response.status(200).json({
            revenue: {
                percent: Math.abs(+revenuePercent),
                compare: Math.abs(+compareRevenue),
                yesterday: +yesterdayRevenue,
                isHigher: +revenuePercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
        
    } catch(e){
        errorHandler(response, e)
    }
}

module.exports.analytics = async function(request, response){
    try{
        const allOrders = await Order.find({user: request.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)

        // Calculating of average check
        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2)

        // Graphs
        const chart = Object.keys(ordersMap).map(label => {
            // example: label == 02.22.2020
            const revenue = calculatePrice(ordersMap[label])
            const order = ordersMap[label].length

            return {label, order, revenue}
        })

        response.status(200).json({average, chart})
    } catch(e){
        errorHandler(response, e)
    }
}

function getOrdersMap(orders = []){
    const daysOrder = {}
    orders.forEach(order => {
        const date = moment(order.date).format('MM.DD.YYYY')

        if(date === moment().format('MM.DD.YYYY')){
            return
        }

        if(!daysOrder[date]){
            daysOrder[date] = []
        }

        daysOrder[date].push(order)
    })

    return daysOrder
}

function calculatePrice(orders = []){
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice
    }, 0)
}