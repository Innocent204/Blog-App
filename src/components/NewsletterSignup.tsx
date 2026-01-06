import React from 'react';

interface NewsletterSignupProps {
    email: string;
    onSubmit: (email: string) => void;
    title: string;
    description: string;
    buttonText: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ email, onSubmit, title, description, buttonText }) => {
    const [inputEmail, setInputEmail] = React.useState(email);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(inputEmail);
    };

    return (
        <div className="newsletter-signup">
            <h2>{title}</h2>
            <p>{description}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <button type="submit">{buttonText}</button>
            </form>
        </div>
    );
};

export default NewsletterSignup;