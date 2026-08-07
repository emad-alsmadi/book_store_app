'use client';

import { useState } from 'react';
import {
  useAdminOrders,
  useUpdateOrderStatusMutation,
} from '@/hooks/admin/adminQuery';
import { useConfirm } from '@/components/confirm/ConfirmProvider';
import { useToast } from '@/components/ui/Toast';
import {
  getUserFacingErrorMessage,
  logErrorForDev,
} from '@/lib/userFacingError';
import type { AdminOrder } from '@/lib/api';
import {
  AdminError,
  AdminLoading,
  AdminPanel,
  AdminSelect,
  AdminTable,
} from './admin-ui';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'canceled', label: 'Canceled' },
];

function customerLabel(order: AdminOrder) {
  if (order.user && typeof order.user === 'object') {
    return order.user.email || order.user.username || 'Customer';
  }
  return typeof order.user === 'string' ? order.user : 'Customer';
}

function shortId(id: string) {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

export function AdminOrdersPanel() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [statusFilter, setStatusFilter] = useState('');
  const ordersQ = useAdminOrders({
    limit: 50,
    status: statusFilter || undefined,
  });
  const updateMut = useUpdateOrderStatusMutation();

  const orders = ordersQ.data?.data || [];
  const meta = ordersQ.data?.meta;

  function onChangeStatus(order: AdminOrder, next: string) {
    if (!next || next === order.status) return;

    void confirm({
      title: 'Update order status?',
      description: `Change order ${shortId(order._id)} from "${order.status}" to "${next}"?`,
      confirmLabel: 'Update',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        try {
          await updateMut.mutateAsync({ id: order._id, status: next });
          toast(`Order updated to ${next}`, {
            title: 'Updated',
            variant: 'success',
          });
        } catch (err) {
          logErrorForDev(err);
          toast(getUserFacingErrorMessage(err, 'Failed to update order'), {
            title: 'Error',
            variant: 'error',
          });
          throw err;
        }
      },
    });
  }

  if (ordersQ.isLoading) return <AdminLoading />;

  if (ordersQ.isError) {
    return (
      <AdminPanel title='Orders'>
        <AdminError
          message={getUserFacingErrorMessage(
            ordersQ.error,
            'Failed to load orders',
          )}
        />
      </AdminPanel>
    );
  }

  return (
    <AdminPanel
      title='Orders'
      description='Fulfillment status only. Paid is set by Stripe webhook — not from this panel.'
      action={
        <AdminSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label='Filter by status'
          className='min-w-[160px]'
        >
          {STATUS_FILTERS.map((s) => (
            <option
              key={s.value || 'all'}
              value={s.value}
            >
              {s.label}
            </option>
          ))}
        </AdminSelect>
      }
    >
      <AdminTable
        headers={[
          'Order',
          'Customer',
          'Total',
          'Payment',
          'Status',
          'Next action',
        ]}
        empty={orders.length === 0}
      >
        {orders.map((order) => {
          const next = order.allowedNextStatuses || [];
          return (
            <tr
              key={order._id}
              className='bg-white/30'
            >
              <td className='px-4 py-3 font-mono text-xs font-semibold text-indigo-950'>
                {shortId(order._id)}
              </td>
              <td className='px-4 py-3 font-semibold text-indigo-950'>
                {customerLabel(order)}
              </td>
              <td className='px-4 py-3 font-semibold text-indigo-950'>
                ${Number(order.totalPrice || 0).toFixed(2)}
              </td>
              <td className='px-4 py-3 font-semibold text-indigo-950/80'>
                {order.paymentStatus || '—'}
              </td>
              <td className='px-4 py-3'>
                <span className='rounded-full bg-indigo-950/5 px-2 py-1 text-xs font-extrabold text-indigo-950'>
                  {order.status}
                </span>
              </td>
              <td className='px-4 py-3'>
                {next.length === 0 ? (
                  <span className='text-xs font-semibold text-indigo-950/50'>
                    —
                  </span>
                ) : (
                  <AdminSelect
                    value=''
                    disabled={updateMut.isPending}
                    onChange={(e) => onChangeStatus(order, e.target.value)}
                    aria-label={`Update status for ${order._id}`}
                  >
                    <option value=''>Set status…</option>
                    {next.map((s) => (
                      <option
                        key={s}
                        value={s}
                      >
                        {s}
                      </option>
                    ))}
                  </AdminSelect>
                )}
              </td>
            </tr>
          );
        })}
      </AdminTable>
      {meta ? (
        <p className='mt-3 text-xs font-semibold text-indigo-950/55'>
          Showing {orders.length} of {meta.total} orders
        </p>
      ) : null}
    </AdminPanel>
  );
}
