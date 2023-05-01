import {Stripe} from 'stripe';

 async function payment({
    stripe =new Stripe(process.env.stripKey),
    payment_method_types=['card'],
        mode='payment',
        customer_email,
        metadata={},
        cancel_url=process.env.cancel_url,
        success_url=process.env.success_url,
        discounts=[],
        line_items=[],
        percent_off=0,
        duration='once'

}={}){
    const cuponPayment =await stripe.coupons.create({
        percent_off,
        duration,
    })
          const session=await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        cancel_url,
        success_url,
        discounts:cuponPayment?[{coupon:cuponPayment.id}]:[],
        line_items
     })
    return session; 
}
export default payment;