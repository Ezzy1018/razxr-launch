import type { ProjectSeed } from "@/types";

export const shopFlowProject: ProjectSeed = {
  id: "proj-shopflow",
  title: "ShopFlow Backend",
  description:
    "E-commerce order and inventory service for high-volume checkout traffic.",
  track: "ecommerce",
  difficulty: "medium",
  files: {
    "app/services/inventory.py": `from dataclasses import dataclass\n\n@dataclass\nclass StockItem:\n    sku: str\n    quantity: int\n\ndef reserve(item: StockItem, qty: int) -> bool:\n    if item.quantity < qty:\n        return False\n    item.quantity -= qty\n    return True\n`,
    "app/services/pricing.py": `def final_price(amount: float, discount: float = 0.0) -> float:\n    return amount - (amount * discount)\n`,
    "app/routes/orders.py": `from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get(\"/health\")\ndef health():\n    return {\"ok\": True}\n`,
  },
  tickets: [
    {
      id: "ticket-shopflow-1",
      title: "Prevent negative stock",
      description:
        "Reservation should fail when qty <= 0 or when result would make stock negative.",
      difficulty: "easy",
      testCases: [
        {
          input: "quantity=3,qty=4",
          expected: "false",
          description: "Insufficient stock fails.",
        },
      ],
    },
    {
      id: "ticket-shopflow-2",
      title: "Fix floating-point billing output",
      description:
        "Normalize final price to two decimals to avoid checkout mismatch.",
      difficulty: "medium",
      testCases: [
        {
          input: "amount=19.99,discount=0.15",
          expected: "16.99",
          description: "Rounded currency output.",
        },
      ],
    },
    {
      id: "ticket-shopflow-3",
      title: "Add low-stock signal",
      description:
        "Expose helper to mark SKUs as low stock when quantity <= threshold.",
      difficulty: "medium",
      testCases: [
        {
          input: "quantity=4,threshold=5",
          expected: "true",
          description: "Low stock returns true.",
        },
      ],
    },
  ],
};
