import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateContact } from '../../hooks/useContact';
import { Input, Textarea, Button } from '../ui';

const contactSchema = z.object({
  name: z.string().min(2, 'נא להזין שם מלא'),
  email: z.string().email('נא להזין כתובת אימייל תקינה'),
  phone: z.string().optional(),
  message: z.string().min(10, 'ההודעה צריכה להכיל לפחות 10 תווים'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { mutate, isPending, isSuccess } = useCreateContact();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6 bg-cream-100 rounded-2xl border border-gold-200">
        <div className="text-4xl mb-4">&#10004;</div>
        <h3 className="font-display text-xl text-gold-700 mb-2">תודה על פנייתך!</h3>
        <p className="text-gold-600/80">נחזור אליך בהקדם האפשרי.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="שם מלא"
        placeholder="ישראל ישראלי"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="אימייל"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="טלפון (אופציונלי)"
        type="tel"
        placeholder="050-0000000"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Textarea
        label="הודעה"
        placeholder="כתבו לנו את הודעתכם..."
        rows={5}
        error={errors.message?.message}
        {...register('message')}
      />

      <Button type="submit" loading={isPending} className="w-full">
        שלח הודעה
      </Button>
    </form>
  );
}
