interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-light text-gray-800 mb-6 leading-tight" style={{ fontFamily: 'serif' }}>
        {title}
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}