import { rest } from 'msw'

const handlers = [
  rest.post('/v1/cart/add', (req, res, ctx) => {
    const { userId, productId, quantity } = req.body
    return res(
      ctx.status(200),
      ctx.json({ userId, productId, quantity })
    )
  }),
  rest.get('/v1/cart/:userId', (req, res, ctx) => {
    const { userId } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        userId,
        cartItems: [
          { id: 1, productId: 1, quantity: 2, product: { id: 1, name: 'Product 1', price: 10 } }
        ]
      })
    )
  }),
  rest.delete('/v1/cart/remove', (req, res, ctx) => {
    const { userId, productId } = req.body
    return res(
      ctx.status(200),
      ctx.json({ message: 'Item removed from cart' })
    )
  }),
  rest.post('/v1/cart/clear', (req, res, ctx) => {
    const { userId } = req.body
    return res(
      ctx.status(200),
      ctx.json({ message: 'Cart cleared' })
    )
  })
]

export { handlers }
