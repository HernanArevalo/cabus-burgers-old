import { z } from "zod"

export const checkoutSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  email: z.string().trim().email(),
  shippingMethod: z.enum(["retiro", "delivery"]),
  street: z.string().trim().optional().default(""),
  number: z.string().trim().optional().default(""),
  neighborhood: z.string().trim().optional().default(""),
  paymentMethod: z.enum(["efectivo", "transferencia", "mercadopago"]),
  cashAmount: z.string().trim().optional().default(""),
  observations: z.string().trim().optional().default(""),
})

export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
  selectedExtras: z.array(
    z.object({
      id: z.string(),
    })
  ),
  observations: z.string().optional().default(""),
})

export const createOrderInputSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().int().nonnegative(),
  shippingCost: z.number().int().nonnegative(),
  paymentAdjustment: z.number().int(),
  total: z.number().int().nonnegative(),
  customer: checkoutSchema,
})

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>
