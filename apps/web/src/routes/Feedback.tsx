import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CaseType } from '@covenant-shield/shared';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  type: z.nativeEnum(CaseType),
  subject: z.string().min(3, 'Subject is required'),
  description: z.string().min(10, 'Detailed description is required'),
  rating: z.coerce.number().min(1).max(5).optional(),
  contactPhone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const Feedback: React.FC = () => {
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: CaseType.COMPLAINT,
      rating: 5,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback case');
      }

      const result = await res.json();
      setSuccessRef(result.referenceNumber);
      reset();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2">Feedback & Complaint Submission</h2>
        <p className="text-sm text-gray-600 mb-6">
          Submit complaints, suggestions, or compliments. Every case is logged, assigned, and responded to.
        </p>

        {successRef ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg text-emerald-900 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="text-xl font-bold">Case Logged Successfully</h3>
            <p className="text-sm text-gray-700">Your unique case reference number is:</p>
            <div className="text-2xl font-mono font-bold text-emerald-900 bg-emerald-100 py-2 px-4 rounded inline-block">
              {successRef}
            </div>
            <p className="text-xs text-gray-500 pt-2">
              You can track case updates and response history anytime using this reference number.
            </p>
            <button
              onClick={() => setSuccessRef(null)}
              className="mt-4 bg-emerald-900 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-emerald-950 transition"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">Feedback Category *</label>
              <select
                {...register('type')}
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-900"
              >
                <option value={CaseType.COMPLAINT}>Complaint</option>
                <option value={CaseType.COMPLIMENT}>Compliment</option>
                <option value={CaseType.SUGGESTION}>Suggestion</option>
                <option value={CaseType.GENERAL_FEEDBACK}>General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">Subject *</label>
              <input
                {...register('subject')}
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-900"
                placeholder="Brief summary"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">Description *</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-900"
                placeholder="Please describe the situation or feedback in detail..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-md shadow transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Case'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
