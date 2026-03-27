type ToolPageFrameProps = {
  title: string;
  description: string;
  sourceFile: string;
};

export function ToolPageFrame({ title, description, sourceFile }: ToolPageFrameProps) {
  return (
    <main>
      <section className="container page-section">
        <h2>{title}</h2>
        <p className="muted">{description}</p>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.4rem" }}>
          Editable source: <code>{sourceFile}</code>
        </p>
      </section>
      <section className="frame-wrap">
        <iframe className="tool-frame" src={sourceFile} title={title} />
      </section>
    </main>
  );
}
