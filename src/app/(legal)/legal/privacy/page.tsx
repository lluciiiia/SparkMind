import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-navy">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. It is SparkMind's policy to respect your privacy and comply
        with any applicable law and regulation regarding any personal information we may collect
        about you, including across our website, https://www.sparkmind-ai.com, and other sites we
        own and operate.
      </p>

      <p className="mb-4">
        This policy is effective as of 1 June 2023 and was last updated on 1 June 2023.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Information We Collect</h2>
        <p className="mb-4">
          Information we collect includes both information you knowingly and actively provide us
          when using or participating in any of our services and promotions, and any information
          automatically sent by your devices in the course of accessing our products and services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Log Data</h2>
        <p className="mb-4">
          When you visit our website, our servers may automatically log the standard data provided
          by your web browser. It may include your device's Internet Protocol (IP) address, your
          browser type and version, the pages you visit, the time and date of your visit, the time
          spent on each page, other details about your visit, and technical details that occur in
          conjunction with any errors you may encounter.
        </p>
        <p className="mb-4">
          Please be aware that while this information may not be personally identifying by itself,
          it may be possible to combine it with other data to personally identify individual
          persons.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Personal Information</h2>
        <p className="mb-4">
          We may ask for personal information which may include one or more of the following:
        </p>
        <ul className="list-disc list-inside mb-4 text-navy">
          <li>Name</li>
          <li>Email</li>
          <li>Social media profiles</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Use of Google User Data</h2>
        <p className="mb-4">
          Our application integrates with Google APIs to provide certain functionalities, such as calendar access. In doing so, we may collect Google user data, which includes but is not limited to your email, profile information, and calendar events. This data is collected strictly to provide or improve your experience and the functionality of the application.
        </p>
        <p className="mb-4">
          We adhere to the principle of minimum access to data, requesting only the necessary Google API scopes to function, such as API_CL and API_CL_EVENTS for calendar-related services. We do not request additional permissions beyond what is required for these functionalities.
        </p>
        <p className="mb-4">
          Specifically, we access the following Google API scopes:
        </p>
        <ul className="list-disc list-inside mb-4 text-navy">
          <li><strong>API_CL:</strong> Calendar list data</li>
          <li><strong>API_CL_EVENTS:</strong> Calendar events data</li>
        </ul>
        <p className="mb-4">
          We do not collect, share, or transfer your Google user data for any purposes unrelated to the functionality and improvement of our application. Your Google data will never be used for marketing purposes or transferred to third parties, except for service providers who are contractually obligated to protect the data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">
          Disclosure of Personal Information to Third Parties
        </h2>
        <p className="mb-4">We may disclose personal information to:</p>
        <ul className="list-disc list-inside mb-4 text-navy">
          <li>A parent, subsidiary, or affiliate of our company</li>
          <li>
            Third-party service providers for the purpose of enabling them to provide their
            services, for example, IT service providers, data storage, hosting, server providers, and analytics platforms
          </li>
          <li>Our employees, contractors, and/or related entities</li>
          <li>Third parties, including agents or sub-contractors, who assist us in providing
            services directly related to your use of Google APIs
          </li>
        </ul>
        <p className="mb-4">
          We do not share or transfer Google user data to third parties for purposes unrelated to the application functionality, and we will not use this data for advertising purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Security of Your Personal Information</h2>
        <p className="mb-4">
          When we collect and process personal information, including Google user data, we implement industry-standard security measures to protect the information against unauthorized access, disclosure, alteration, or destruction.
        </p>
        <p className="mb-4">
          We will retain personal information, including Google user data, only as long as is necessary to fulfill the purpose for which it was collected or as required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">International Transfers of Personal Information</h2>
        <p className="mb-4">
          The personal information we collect may be stored and processed outside your country of residence. If we transfer your data internationally, including Google user data, we ensure that the data is protected by appropriate safeguards, such as binding corporate rules or data protection agreements, to comply with applicable laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this privacy policy to reflect changes in our data practices or applicable laws. Any significant changes to the use of Google user data will be communicated clearly on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding this privacy policy, including how we handle your Google user data, please contact us at privacy@sparkmind-ai.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;
