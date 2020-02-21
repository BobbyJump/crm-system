import { Injectable } from '@angular/core';
import { Position, OrderPosition } from '../shared/interfaces';

@Injectable()

export class OrderService{

    public list: OrderPosition[] = []
    public price = 0

    add(position: Position){
        const orderPosition: OrderPosition = Object.assign({}, {
            name: position.name,
            cost: position.cost,
            quantity: position.quantity,
            _id: position._id
        })

        const candidate = this.list.find(p => p._id === orderPosition._id)
        if(candidate){
            //change quantity
            candidate.quantity += orderPosition.quantity
        } else{
            //add position
            this.list.push(orderPosition)
        }

        this.computePrice()
    }

    remove(orderPosition: OrderPosition){
        const index = this.list.findIndex(p => p._id === orderPosition._id)
        this.list.splice(index, 1)
        this.computePrice()
    }

    clear(){

    }

    private computePrice(){
        // calculating of total price
        this.price = this.list.reduce((total, item) => {
             return total += item.quantity * item.cost
        }, 0)
    }
}