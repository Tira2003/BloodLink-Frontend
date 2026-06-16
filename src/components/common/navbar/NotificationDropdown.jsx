import Badge from '../../ui/Badge';
import DropdownMenu from '../../ui/DropdownMenu';

export default function NotificationDropdown({ notifications, unread }) {
  return (
    <DropdownMenu className="w-[340px]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle font-semibold text-sm">
        <span>Notifications</span>
        {unread > 0 && <Badge variant="primary">{unread} new</Badge>}
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 px-5 py-4 border-b border-border-subtle last:border-b-0 hover:bg-primary-light/40 cursor-pointer transition-colors ${
                !n.isRead ? 'bg-primary-light/30' : ''
              }`}
            >
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              <div className="flex-1">
                <div className="font-semibold text-sm">{n.title}</div>
                <div className="text-xs text-text-secondary mt-1">{n.message}</div>
                <div className="text-xs text-text-muted mt-1">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DropdownMenu>
  );
}
