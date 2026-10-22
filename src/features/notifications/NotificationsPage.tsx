import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader, Badge, InfoBanner, EmptyState } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Select } from '@/components/forms/FormComponents';
import type { AppNotification, NotificationType } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';
import { formatDate } from '@/lib/formatters';
import {
  Bell,
  CheckCircle2,
  CloudSun,
  TrendingUp,
  Calendar,
  BookOpen,
  Trash2,
  ExternalLink,
  CheckCheck,
  Circle,
} from 'lucide-react';

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  weather: <CloudSun className="w-5 h-5 text-[var(--color-primary-600)]" />,
  market: <TrendingUp className="w-5 h-5 text-[var(--color-primary-600)]" />,
  crop_reminder: <Calendar className="w-5 h-5 text-[var(--color-primary-600)]" />,
  scheme: <BookOpen className="w-5 h-5 text-[var(--color-primary-600)]" />,
  system: <Bell className="w-5 h-5 text-[var(--color-primary-600)]" />,
};

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'weather',
    title: 'Rain advisory: Potential shower in Thanjavur',
    message: 'Monsoon activity may bring moderate rain (60% probability) within 48 hours. Postpone open spraying of chemicals.',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDismissed: false,
    destinationRoute: '/weather',
  },
  {
    id: 'notif-2',
    type: 'market',
    title: 'Paddy Modal Price Update at Thanjavur APMC',
    message: 'Paddy (Common) modal price reached ₹2,320/quintal today, matching current MSP baseline.',
    date: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDismissed: false,
    destinationRoute: '/market-prices',
  },
  {
    id: 'notif-3',
    type: 'crop_reminder',
    title: 'Paddy top-dressing reminder',
    message: 'Time for first split dose application of Nitrogen (Urea) at active tillering stage (20–25 DAS).',
    date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isDismissed: false,
    destinationRoute: '/calendar',
  },
  {
    id: 'notif-4',
    type: 'scheme',
    title: 'PM-KISAN: Verification window open for next installment',
    message: 'Check eKYC status and ensure Aadhaar is seeded with bank account on the official portal (pmkisan.gov.in).',
    date: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isDismissed: false,
    destinationRoute: '/schemes',
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    storageGet(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS)
  );

  const [categoryFilter, setCategoryFilter] = useState<'all' | NotificationType>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  function saveNotifications(updated: AppNotification[]) {
    setNotifications(updated);
    storageSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  function handleToggleRead(id: string) {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, isRead: !n.isRead } : n
    );
    saveNotifications(updated);
  }

  function handleMarkAllAsRead() {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    saveNotifications(updated);
  }

  function handleDismiss(id: string) {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  }

  function handleNotificationClick(n: AppNotification) {
    if (!n.isRead) {
      handleToggleRead(n.id);
    }
    if (n.destinationRoute) {
      navigate(n.destinationRoute);
    }
  }

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (categoryFilter !== 'all' && n.type !== categoryFilter) return false;
      if (unreadOnly && n.isRead) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications, categoryFilter, unreadOnly]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Weather advisories, mandi rate updates, scheme notices, and farm reminders"
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              onClick={handleMarkAllAsRead}
            >
              Mark All Read ({unreadCount})
            </Button>
          ) : undefined
        }
      />

      <InfoBanner variant="info">
        <strong>Official Communications Registry:</strong> Real-time agro-meteorological advisories, APMC modal market alerts, and scheme sanction updates issued by State & District Agricultural Directorates.
      </InfoBanner>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select
            className="text-xs py-1.5"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
          >
            <option value="all">All Categories</option>
            <option value="weather">Weather alerts</option>
            <option value="market">Market prices</option>
            <option value="crop_reminder">Crop reminders</option>
            <option value="scheme">Govt schemes</option>
          </Select>

          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              unreadOnly
                ? 'bg-[var(--color-primary-600)] border-[var(--color-primary-600)] text-white'
                : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            Unread only ({unreadCount})
          </button>
        </div>

        <span className="text-xs text-[var(--color-text-muted)]">
          {notifications.length} total alerts
        </span>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell className="w-12 h-12 text-[var(--color-text-muted)]" />}
            title="No notifications to show"
            description={
              unreadOnly
                ? 'All alerts in this category are marked as read.'
                : 'No notification records present.'
            }
            action={
              unreadOnly ? (
                <Button variant="outline" size="sm" onClick={() => setUnreadOnly(false)}>
                  Show all notifications
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(notif => {
            return (
              <Card
                key={notif.id}
                className={`transition-all ${
                  !notif.isRead
                    ? 'border-[var(--color-primary-300)] bg-[var(--color-primary-50)]/30 shadow-xs'
                    : 'bg-white opacity-85'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {NOTIFICATION_ICONS[notif.type]}
                  </div>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge>
                        {notif.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        {formatDate(notif.date)}
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold text-[var(--color-text-primary)] ${!notif.isRead ? '' : 'font-semibold'}`}>
                      {notif.title}
                    </h3>

                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.destinationRoute && (
                      <span className="text-[11px] font-semibold text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline inline-flex items-center gap-1 mt-2">
                        View related page <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleRead(notif.id)}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-neutral-900 rounded-lg transition-colors"
                      title={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                      aria-label="Toggle read status"
                    >
                      {notif.isRead ? <Circle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-neutral-800" />}
                    </button>
                    <button
                      onClick={() => handleDismiss(notif.id)}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-neutral-900 rounded-lg transition-colors"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
