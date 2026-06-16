export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-8 text-text-muted">
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-5 bg-primary-light rounded-full flex items-center justify-center text-primary">
          <Icon size={28} />
        </div>
      )}
      {title && <h3 className="text-lg font-bold text-text mb-2">{title}</h3>}
      {description && (
        <p className="text-sm max-w-xs mx-auto leading-relaxed mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
