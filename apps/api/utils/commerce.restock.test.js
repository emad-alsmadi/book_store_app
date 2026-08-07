const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const { restoreStockForCanceledOrder } = require('./commerce');

describe('restoreStockForCanceledOrder', () => {
  it('increments product-level stock', async () => {
    const productDoc = {
      _id: 'p1',
      stock: 2,
      variants: [],
      save: mock.fn(async () => {}),
    };
    const Product = {
      findById: mock.fn(async () => productDoc),
      findByIdAndUpdate: mock.fn(async () => ({ stock: 5 })),
    };

    await restoreStockForCanceledOrder(Product, {
      items: [{ productId: 'p1', qty: 3 }],
    });

    assert.equal(Product.findByIdAndUpdate.mock.callCount(), 1);
    assert.deepEqual(Product.findByIdAndUpdate.mock.calls[0].arguments[1], {
      $inc: { stock: 3 },
    });
  });

  it('increments matching variant stock and syncs product.stock', async () => {
    const productDoc = {
      _id: 'p2',
      stock: 1,
      variants: [
        { size: 'M', color: 'Red', stock: 1 },
        { size: 'L', color: 'Blue', stock: 0 },
      ],
      save: mock.fn(async () => {}),
    };
    const Product = {
      findById: mock.fn(async () => productDoc),
      findByIdAndUpdate: mock.fn(async () => {}),
    };

    await restoreStockForCanceledOrder(Product, {
      items: [
        {
          productId: 'p2',
          qty: 2,
          variant: { size: 'M', color: 'Red' },
        },
      ],
    });

    assert.equal(productDoc.variants[0].stock, 3);
    assert.equal(productDoc.stock, 3);
    assert.equal(productDoc.save.mock.callCount(), 1);
  });
});
