type GroupIdPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GroupIdPage({ params }: GroupIdPageProps) {
  const { id } = await params;

  return <div>GroupId page {id}</div>;
}
