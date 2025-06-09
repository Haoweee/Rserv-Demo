import { Mail, MessageCircleQuestion, LifeBuoy, BookOpen } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Help Center</h1>
        <p className="text-gray-600 mt-2">
          Find answers to common admin questions and platform usage tips.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <HelpCard
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          title="Getting Started"
          description="Learn how to set up your restaurant profile, add staff, and manage reservations."
        />
        <HelpCard
          icon={<MessageCircleQuestion className="w-6 h-6 text-green-600" />}
          title="FAQs"
          description="Browse frequently asked questions about admin features and tools."
        />
        <HelpCard
          icon={<LifeBuoy className="w-6 h-6 text-purple-600" />}
          title="Troubleshooting"
          description="Fix common issues like login errors, permission problems, and UI bugs."
        />
        <HelpCard
          icon={<Mail className="w-6 h-6 text-red-500" />}
          title="Contact Support"
          description="Need more help? Reach out to our team for direct assistance."
        />
      </div>

      {/* Contact Section */}
      <div className="mt-10 bg-gray-100 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Still need help?</h2>
        <p className="text-gray-600 mb-4">
          If you can’t find the answer you’re looking for, our support team is here to help.
        </p>
        <a
          href="mailto:support@yourapp.com"
          className="inline-block bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          Email Support
        </a>
      </div>
    </div>
  );
}

function HelpCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
