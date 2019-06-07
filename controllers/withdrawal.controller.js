/**
 * @author Ajilore Raphael Olamide <raphealolams@yahoo.com raphealolams@gmail.com>
 * @author Everything about Fund Withdrawal
*/

const BankServices = require('../service')
const Withdrawal = {};


const notAllowed = [100, 200, 300, 400]

Withdrawal.withdrawFunds = async function withdrawFunds(req, res, next) {
    try {
        const { amount } = req.body;
        const { decoded } = res;

        if (amount && (decoded && decoded.validated)) {
            const { card: {accountNumber} } = decoded

            console.log(accountNumber)

            // check if the user enter's amount lesser than 500
            if (notAllowed.includes(Number(amount))) return res.status(200).json({
                status: true,
                message: "Enter Amount Greater than or equal to 500",
                balance: null
            }).end()



            // now check if the amount is greater than 500 and it's modulus returns 0 (used modulus to check case's where the user will enter 1500, 2000, or 2500)
            console.log(Number(amount) % 500)
            if (Number(amount) % 500 === 0) {

                // send the amount and account number to the mock bank service (this check's the balance as against amount been withdraw)
                
                transactionStatus = await BankServices.handleDebit(accountNumber, amount)

                // console.log({transactionStatus})

                if (transactionStatus.status) return res.status(200).json({
                    status: true,
                    message: "Withdrawal Successful",
                    balance: transactionStatus.balance
                }).end()
               
                //NOT ENOUGH FUNDS FOR WITHDRAWAL//
                return res.status(200).json({
                    status: false,
                    message: "Insufficient Funds",
                    balance: null
                }).end();
            }


            return res.status(200).json({
                status: true,
                message: "Enter Amount in multiples of 500 or 1000",
                balance: null
            }).end()

        }

        return res.status(400).json().end()

    } catch (error) {
        console.error(error)
        next(error)
    }
};



module.exports = Withdrawal;