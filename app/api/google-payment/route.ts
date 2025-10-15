import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, customerInfo, paymentMethod } = await request.json()

    // Simulate Google Pay processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate dummy Google Pay transaction data
    const googlePayData = {
      transactionId: `GP-${Date.now().toString().slice(-8)}`,
      referenceNumber: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      amount: amount / 100, // Convert back to actual amount
      currency: currency || 'USD',
      paymentMethod: paymentMethod || 'google_pay',
      status: 'completed',
      timestamp: new Date().toISOString(),
      customerInfo: {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        country: customerInfo.country || 'US'
      },
      googlePayDetails: {
        paymentToken: `tok_${Math.random().toString(36).substr(2, 20)}`,
        merchantId: 'FALCO-P-001',
        gateway: 'Google Pay Gateway',
        cardType: 'Google Pay Card',
        maskedCardNumber: '**** **** **** 5678',
        expiryDate: '12/26',
        cardholderName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        securityLevel: 'High',
        complianceStatus: 'PCI-DSS Level 1',
        fraudCheck: 'Passed',
        riskScore: 'Low',
        googlePayVersion: '2.0',
        deviceInfo: {
          deviceType: 'Mobile',
          os: 'Android/iOS',
          browser: 'Chrome/Safari'
        }
      },
      receipt: {
        merchantName: 'Falco P - Premium Sportswear',
        merchantId: 'FALCO-P-001',
        terminalId: 'TERM-GP-001',
        authorizationCode: `AUTH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        transactionType: 'Purchase',
        cardType: 'Google Pay',
        maskedCardNumber: '**** **** **** 5678',
        expiryDate: '12/26',
        cardholderName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        transactionDate: new Date().toLocaleString('en-US'),
        transactionTime: new Date().toLocaleTimeString('en-US'),
        location: 'Online Store',
        currency: currency || 'USD',
        amount: amount / 100,
        processingFee: 0,
        totalAmount: amount / 100,
        receiptNumber: `RCP-GP-${Date.now().toString().slice(-6)}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GP-${Date.now()}`
      }
    }

    // Simulate success or failure based on amount
    const isSuccess = amount > 0 && amount < 100000 // Max $1000 for dummy success

    if (isSuccess) {
      // Log the transaction (in a real app, this would go to a database)
      console.log('Google Pay Transaction Processed:', {
        transactionId: googlePayData.transactionId,
        amount: googlePayData.amount,
        currency: googlePayData.currency,
        customer: googlePayData.customerInfo.name,
        timestamp: googlePayData.timestamp
      })

      return NextResponse.json({
        success: true,
        message: 'Google Pay payment processed successfully',
        data: googlePayData
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Google Pay payment failed',
        message: 'Please check your payment details or try a different amount.'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Google Pay payment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Google Pay payment processing failed',
      message: 'Please try again or contact support'
    }, { status: 500 })
  }
}
