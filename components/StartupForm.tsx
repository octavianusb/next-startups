"use client";

import React, { useActionState, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { z } from 'zod';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { formSchema } from '@/lib/validation';
import { createPitch } from '@/lib/actions';

const StartupForm = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState<string>('');
    
    const handleFormSubmit = async (prevState: { error: string; status: string }, formData: FormData) => {
        try {
            const formValues = {
                ...Object.fromEntries(formData.entries()),
                pitch,
            };
            await formSchema.parseAsync(formValues);
            console.log('Form Values:', formValues);

            const result = await createPitch(prevState, formData, pitch)

            if (result?.status == 'SUCCESS') {
                toast.success('Your startup pitch has been submitted successfully!');
                router.push(`/startup/${result._id}`);
            }

            return result;
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors = err.flatten().fieldErrors;
                setErrors(fieldErrors as unknown as Record<string, string>);

                toast.error("Please check your inputs and try again.");

                return { ...prevState, error: 'Validation failed', status: 'ERROR' };
            }

            toast.error('An unexpected error has occurred');
            return { ...prevState, error: 'An unexpected error has occurred', status: 'ERROR' };
        }
    }
    
    const [, formAction, isPending] = useActionState(handleFormSubmit, {
        error: '',
        status: 'INITIAL'
    });

    return (
        <form action={formAction} className='startup-form'>
            <div>
                <label htmlFor="title" className='startup-form_label'>Title</label>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder='Startup title...'
                    className='startup-form_input'
                    required
                />
                {errors?.title && <p className='startup-form_error'>{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className='startup-form_label'>Description</label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder='Startup description...'
                    className='startup-form_textarea'
                    required
                />
                {errors?.description && <p className='startup-form_error'>{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className='startup-form_label'>Category</label>
                <Input
                    type="text"
                    id="category"
                    name="category"
                    placeholder='Startup category (Tech, Health, Eduction...)'
                    className='startup-form_input'
                    required
                />
                {errors?.category && <p className='startup-form_error'>{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="link" className='startup-form_label'>Image URL</label>
                <Input
                    type="text"
                    id="link"
                    name="link"
                    placeholder='Startup image URL'
                    className='startup-form_input'
                    required
                />
                {errors?.link && <p className='startup-form_error'>{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className='startup-form_label'>Pitch</label>
                <MDEditor
                    id="pitch"
                    value={pitch}
                    onChange={(val) => setPitch(val as string)}
                    preview='edit'
                    height={300}
                    style={{ overflow: 'hidden', borderRadius: '20px', borderWidth: '3px', borderColor: '#000' }}
                    textareaProps={{
                        placeholder: 'Briefly describe your idea and what problem it solves...',
                    }}
                    previewOptions={{
                        disallowedElements: ['style'],
                    }}
                />
                {errors?.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
            </div>

            <Button
                type='submit'
                className='startup-form_btn text-white'
                disabled={isPending}
            >
                {isPending ? 'Submitting...' : 'Submit your pitch'}
                <Send className='ml-2 size-6' />
            </Button>
        </form>
    );
}

export default StartupForm;
