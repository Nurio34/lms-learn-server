const { Iyzipay, iyzipay } = require("../iyzipay");
const studentCourses = require("../models/studentCourses");
const StudentCourses = require("../models/studentCourses");
const Courses = require("../models/course");

const mockRequest = {
    locale: "en",
    conversationId: "deviyzico",
    price: "10.01",
    paidPrice: "10.01",
    currency: "TRY",
    installment: 1,
    paymentChannel: "WEB",
    basketId: "B67832",
    paymentGroup: "PRODUCT",
    paymentCard: {
        cardHolderName: "Mehmet Test",
        cardNumber: "5526080000000006",
        expireYear: "2028",
        expireMonth: "11",
        cvc: "245",
        registerCard: 0,
    },
    buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        identityNumber: "11111111111",
        email: "test@testtt.com",
        gsmNumber: "+905393623333",
        registrationDate: "2013-04-21 15:12:09",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationAddress:
            "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
        ip: "85.34.78.112",
    },
    shippingAddress: {
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
    },
    billingAddress: {
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
    },
    basketItems: [
        {
            id: "BI101",
            price: "10.01",
            name: "Binocular",
            category1: "Collectibles",
            category2: "Accessories",
            itemType: "PHYSICAL",
        },
    ],
};

const makeRequest = async (req, res) => {
    const { purchaseForm, course, student } = req.body;

    const {
        purchaseInfo,
        paymentCard,
        buyer,
        shippingAddress,
        billingAddress,
        basketItems,
    } = purchaseForm;

    const { courseId, title, instructerId, instructerName, courseImage } =
        course;

    const { studentId, studentName, studentEmail } = student;

    //! *** LOCALE DÜZELLE ***
    const locale =
        purchaseInfo.locale === "turkish"
            ? Iyzipay.LOCALE.TR
            : Iyzipay.LOCALE.EN;
    //! **********************
    //! *** CURRENCY DÜZENLE ***
    const currency =
        purchaseInfo.currency === "try"
            ? Iyzipay.CURRENCY.TRY
            : purchaseInfo.currency === "usd"
            ? Iyzipay.CURRENCY.USD
            : Iyzipay.CURRENCY.EUR;
    //! ************************
    //! *** OTHERS ***
    const paymentChannel = Iyzipay.PAYMENT_CHANNEL.WEB;
    const paymentGroup = Iyzipay.PAYMENT_GROUP.PRODUCT;
    //! **************
    //! *** BASKET ITEMTYPE'LARI YENİDEN DÜZENLE ***
    const newBasketItems = basketItems.map((item) => {
        return {
            ...item,
            itemType:
                item.itemType === "physical"
                    ? Iyzipay.BASKET_ITEM_TYPE.PHYSICAL
                    : Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        };
    });

    //! ***************************************

    const PaymentRequest = {
        ...purchaseInfo,
        locale,
        currency,
        paymentChannel,
        paymentGroup,

        paymentCard: { ...paymentCard, cardNumber: "5890040000000016" },
        buyer,
        shippingAddress,
        billingAddress,
        basketItems: newBasketItems,
    };

    try {
        iyzipay.payment.create(PaymentRequest, async (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Purchase couldn't be done. Try again later !",
                });
            }
            if (result.status === "success") {
                const ExistingStudentCourses = await StudentCourses.findOne({
                    studentId,
                });
                let NewStudentCourses = {};
                if (!ExistingStudentCourses) {
                    NewStudentCourses = new StudentCourses({
                        hello: "World",
                        studentId,
                        courses: [
                            {
                                courseId,
                                title,
                                instructerId,
                                instructerName,
                                courseImage: courseImage.imageUrl,
                            },
                        ],
                    });
                } else {
                    NewStudentCourses = ExistingStudentCourses;
                    ExistingStudentCourses.courses.push({
                        courseId,
                        title,
                        instructerId,
                        instructerName,
                        courseImage: courseImage.imageUrl,
                    });
                }
                await NewStudentCourses.save();

                await Courses.findByIdAndUpdate(courseId, {
                    $addToSet: {
                        students: {
                            id: studentId,
                            name: studentName,
                            email: studentEmail,
                        },
                    },
                });

                return res.status(200).json({
                    success: true,
                    message: "Course Purchased Successfully ...",
                    courses: NewStudentCourses,
                });
                //! Here i am !!!
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unexpercted error while makeRequest",
        });
    }
};

module.exports = { makeRequest };
