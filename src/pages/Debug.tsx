import ManualPropertyInput from '../components/ManualPropertyInput';

export default function Debug() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">IDX Integration Debug</h1>
        <ManualPropertyInput />
      </div>
    </div>
  );
}