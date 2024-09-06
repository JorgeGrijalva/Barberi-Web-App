export const ProfilePlaceholder = ({ name, size }: { name?: string; size: number }) => (
  <div
    className="rounded-full aspect-square bg-primary flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    <span className="text-white text-sm" style={{ fontSize: `${size / 3}px` }}>
      {name?.charAt(0)}
    </span>
  </div>
);
