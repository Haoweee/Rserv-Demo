require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_TOKEN);

async function createPaymentIntent(amount, currency, _phoneNumber) {
  try {
    return await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      automatic_payment_methods: { enabled: false },
    });
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function retrievePaymentIntent(intentID) {
  try {
    return await stripe.paymentIntents.retrieve(intentID);
  } catch (error) {
    console.log(error);
    return false;
  }
}

// =================================================== TEST METHODS ===================================================
//
// const createTestCardPaymentMethod = async () => {
//     try {
//       const paymentMethod = await stripe.paymentMethods.create({
//         type: 'card',
//         card: {
//           number: '4242424242424242', // Test card number
//           exp_month: 12,
//           exp_year: 2024,
//           cvc: '123',
//         },
//         billing_details: {
//           name: 'Test User',
//         },
//       });
//       return paymentMethod.id;
//     } catch (error) {
//       console.error('Error creating PaymentMethod:', error);
//     }
//   };
//
// async function confirm(clientSecret){
//     try {
//         payment_method = await createTestCardPaymentMethod()
//         return await stripe.paymentIntents.confirm(
//             clientSecret, {
//                 payment_method
//             }
//         );
//
//     } catch (error) {
//         console.log(error)
//         return false
//     }
// }

module.exports = {
  createPaymentIntent,
  retrievePaymentIntent,
  //  confirm
};
