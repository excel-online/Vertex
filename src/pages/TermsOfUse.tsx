import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronRight,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketService } from '@/services/api';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatButton from '@/components/ChatButton';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

interface TermsSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const footerLinks = {
  explore: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
   { label: 'Terms of Service', href: '/terms-of-use' },
  //  { label: 'Pricing', href: '#pricing' },
   // { label: 'Testimonials', href: '#testimonials' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ]
};


const TermsAndConditions: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await marketService.getTopCoins();
        setCoins(data.slice(0, 20));
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();

    // Trigger entrance animation - coming from top
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  const termsSections: TermsSection[] = [
    {
      id: 'intro',
      title: 'Introduction',
      content: (
        <div className="space-y-4">
          <p>
            This contract explains the use of various conditions applied to the services available at Vellumtrade, in accordance with the law. 
            For questions regarding these terms and conditions, please feel free to contact our customer support team. A direct link to Live Person 
            can be found at the bottom left of the page. You may also contact us via e-mail at{' '}
            <a href="mailto:support@Vellumtrade.com" className="text-blue-600 hover:text-blue-800 underline">support@Vellumtrade.com</a>.
          </p>
          <p>
            Our website is accessible worldwide to anyone with internet access. The access to and use of our site are subject to the following terms and conditions.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="font-semibold text-gray-900">
              BY USING AND ACCESSING OUR SITE, YOU ACCEPT, WITHOUT LIMITATION, ALL OF THESE TERMS AND CONDITIONS.
            </p>
          </div>
          <p>
            We reserve the right to change these terms and conditions at any time. All changes or updates to the Terms & Conditions will be done so by 
            posting of a new and modified version on our site. By using our web site you agree in advance that each use will be subject to the applicable 
            Terms & Conditions. By using our web site you accept its Terms & Conditions and Privacy Statement set forth below. If you do not agree with 
            these policies, please discontinue using this site immediately.
          </p>
        </div>
      ),
    },
    {
      id: 'online-services',
      title: '1. Online Services Agreement',
      content: (
        <div className="space-y-4">
          <p>
            This Agreement is made by and between Vellumtrade ("Our site") and you. This Agreement applies to both our site and trading platform, 
            and to the electronic content and/or software currently contained on our site that provides the customers with real-time information 
            on exchange rates of currencies, and the program transaction services for the forex market via internet, telephone or fax, and any other 
            features, content or services that Vellumtrade may add later (the "Services").
          </p>
        </div>
      ),
    },
    {
      id: 'membership',
      title: '2. Membership Eligibility',
      content: (
        <div className="space-y-4">
          <p>
            Services are available and reserved only for individuals or businesses that can establish a legally binding contract under the laws 
            applicable in their country of residence. Without limiting the undermentioned terms, our Services are not available to people under 
            the age of 18 or who have not attained the legal age ("Minors"). If you are a minor, you cannot use this service.{' '}
            <span className="font-bold text-red-600">PLEASE DO NOT USE THIS SITE IF YOU ARE NOT QUALIFIED.</span>
          </p>
          <p>
            To avoid any doubt, we disclaim any liability for unauthorized use by minors of our Services in any manner or another. In addition, 
            our Services are available only for people who have experience and sufficient knowledge in financial matters, and are able to evaluate 
            the benefits and risks of acquiring financial contracts via this site. You are solely responsible for any decision made by you based 
            on the content of our site.
          </p>
          <p>
            Without derogating from the above-mentioned provision, we disclaim any responsibility for auditing and/or checking your level of knowledge 
            and experience, and any liability for damages or loss suffered as a direct result from your use of our site. This also applies to any 
            transaction and/or use of our Services. Without limiting the above-mentioned provisions, our Services are not available in areas where 
            their use is illegal. Vellumtrade reserves the right to refuse and/or cancel access to its Services to anyone at its sole convenience.
          </p>
        </div>
      ),
    },
    {
      id: 'registration',
      title: '3. Registration Information and Requirements',
      content: (
        <div className="space-y-4">
          <p>
            When registering for a Vellumtrade account, you will have to provide certain identifying information. You are responsible for the security 
            of your account's login and password with Vellumtrade. You are solely responsible for any damage caused by reason of any act or omission 
            resulting in improper or illegal use of your account.
          </p>
          <p>
            You agree to provide accurate and complete information about yourself during the registration process and you also agree not to impersonate 
            another person or entity, and not to hide your identity from Vellumtrade for any reason whatsoever. If you register as a commercial entity, 
            you declare that you have the required authority to bind that entity to this agreement. Vellumtrade treats carefully the information you 
            provide to us according to the disclosure of information provided during the registration process and privacy policy.
          </p>
        </div>
      ),
    },
    {
      id: 'legal-restrictions',
      title: '4. Legal Restrictions',
      content: (
        <div className="space-y-4">
          <p>
            Without limiting the undermentioned provisions, you understand that laws regarding financial contracts vary throughout the world, and it 
            is your responsibility to make sure you properly comply with any law, regulation or guideline in your country of residence regarding the 
            use of our site. To avoid any doubt, the ability to access our site does not necessarily mean that our services and/or your activities 
            through our site are legal under the laws, regulations or directives relevant to your country of residence. You hereby declare that the 
            money in your Vellumtrade account does not come from any illegal or criminal activity.
          </p>
        </div>
      ),
    },
    {
      id: 'license',
      title: '5. License Limitations',
      content: (
        <div className="space-y-4">
          <p>
            Vellumtrade grants you a limited non-exclusive, non-transferable license to access and use our site (the "License"). The license is subject 
            to your compliance with the terms of this agreement. You agree not to resell or make available our site to any other person, and will not 
            copy any documents contained on our site for resale or for any other purpose without the prior written consent of Vellumtrade.
          </p>
          <p>
            To avoid any doubt, you will be liable and bound by any unauthorized use of our site, in violation of this section. You agree to use all 
            the information received from the information systems Vellumtrade for the sole purpose of performing transactions on the sole limits of our site.
          </p>
          <p>
            You also agree not to use electronic communication feature of a service on our site for any illegal, abusive, intrusive, obscene, threatening 
            or hateful purpose, as well as harassment and vilification in the privacy of others. The license granted hereunder shall terminate if Vellumtrade 
            considers that any information provided by you, including your e-mail, is no longer current or accurate, or if you fail to comply with any term 
            or condition of this agreement and all rules and guidelines for each service. It will be the same if Vellumtrade determines that you committed 
            a crime on the Vellumtrade trading platform (including without limitation the conclusion of a transaction outside the market rates). If such a 
            violation occurs, you agree to cease accessing the services. You agree that Vellumtrade, in its sole discretion and with or without notice, 
            may terminate your account, cancel all or part of your Services, close your open transaction and remove and discard any information or content 
            within a service.
          </p>
        </div>
      ),
    },
    {
      id: 'risk-disclosure',
      title: '6. Risk Disclosure',
      content: (
        <div className="space-y-4">
          <p>
            You agree to use our site at your own risk. Without limiting the undermentioned provisions, the services provided on this site is intended 
            only to customers who are able to withstand the loss of any money they invest and who understand the risks and have experience in taking risks 
            in financial markets. The possibility exists that you could endure a loss of some or all of your initial investment and hence you should not 
            invest money that you cannot afford to lose. You should be aware of all the risks related to binary options trading, and solicit advice from 
            an independent financial advisor in case of doubts.
          </p>
        </div>
      ),
    },
    {
      id: 'market-data',
      title: '7. Market Data',
      content: (
        <div className="space-y-4">
          <p>
            Through one or more of our services, Vellumtrade can make available to you a wide range of financial information that is generated internally 
            from agents, suppliers, or partners ("Third Party Providers"). This includes, but is not limited to financial market data, quotes and news, 
            analyst opinions and research reports, graphs and data ("Financial Information").
          </p>
          <p>
            The financial information provided on this site is not intentional investment advice. Vellumtrade offers financial information only as a service. 
            Vellumtrade and its Third Party Providers do not warrant the accuracy, timeliness, completeness or correct sequencing of the financial information, 
            or results of your use of this financial information. The financial information may promptly become unreliable for various reasons, including, 
            for instance, changes in market conditions or economic circumstances. Neither Vellumtrade nor the third party providers are required to update 
            the information or opinions included in the financial information, and we can interrupt the flow of financial information at any time without notice.
          </p>
          <p>
            It is your responsibility to verify the reliability of the information on our site and its suitability for your needs. We exclude all liability 
            for any claim, damage or loss of any kind caused by information contained on our site or referenced by our site.
          </p>
        </div>
      ),
    },
    {
      id: 'hyperlinks',
      title: '8. Hyper Links',
      content: (
        <div className="space-y-4">
          <p>
            Vellumtrade may offer a link to other websites that are provided or controlled by third parties. Such link to a site or sites is neither an 
            endorsement or an approval nor a sponsorship or an affiliation to such site, its owners or its providers. Vellumtrade recommends you make sure 
            you understand the risks associated with the use of such sites before retrieving, using or purchasing via the Internet. Links to these sites 
            are provided solely for your convenience and you agree not to hold Vellumtrade responsible for any loss or damage due to the use or reliance 
            on any content, products or services available on other sites.
          </p>
        </div>
      ),
    },
    {
      id: 'trading-cancellation',
      title: '9. Trading Cancellation',
      content: (
        <div className="space-y-4">
          <p>
            Vellumtrade reserves the right in its sole discretion, to refuse or cancel services, and/or refuse to distribute profits to any person for 
            legitimate reasons, including, without limitation:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>If Vellumtrade has reason to believe that a person's activities on our site may be illegal</li>
            <li>If Vellumtrade may be harmed by any fiscal or pecuniary damage due to anyone's activities</li>
            <li>If Vellumtrade considers that one or more operations on our site were made in violation of this agreement</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'payment',
      title: '10. Payment Procedure',
      content: (
        <div className="space-y-4">
          <p>
            Vellumtrade's finance department supervises every withdrawal request submitted. Identification documents must be submitted for any withdrawal. 
            There is no fee relating to withdrawal by credit card, but any withdrawal by wire transfer will be charged in the amount of $30.
          </p>
          <p>
            Once a withdrawal request has been submitted, it may take up to 5 business days for it to be processed. Once processed, the funds will appear 
            in your bank account. As to when the funds will be visible, will depend on your bank.
          </p>
          <p>
            The minimum amount required to withdrawal earnings is 100, depending on the currency to which your account is set. Transactions made on 
            www.Vellumtrade.com will be represented on your billing statement as www.Vellumtrade.com.
          </p>
        </div>
      ),
    },
    {
      id: 'bonuses',
      title: '11. Bonuses',
      content: (
        <div className="space-y-4">
          <p>
            All bonuses and promotions offered by Vellumtrade are subject to several conditions, including but not limited to minimum deposit amounts, 
            minimum trading volume and any other requirements detailed within the specific offer.
          </p>
          <p>
            In order to redeem a bonus, clients must meet Vellumtrade's required trading volume.
          </p>
          <p>
            Standard required trading volume necessary to redeem a bonus is 30 times the amount of the bonus.
          </p>
          <p>
            Vellumtrade reserves the right to delay or withhold withdrawal of bonuses if any indication of deceptive or fraudulent activity, including 
            but not limited to fraud, manipulation, cash back arbitrage, etc. based on the provisions of the bonus will result in a cancellation of all 
            funds earned on the bonus and the termination of the client account.
          </p>
          <p>
            If traders withdraw funds before reaching the required trading volume, the bonus and profits earned will become null and void, and will be 
            deducted from the trader's account. You may withdraw all remaining funds from your account up to, but not exceeding the amount of the deposit.
          </p>
          <p>
            Within the client's account, the funds that are deposited are kept separate from the funds received as bonuses. All investments are first 
            drawn from the deposited balance and then from the bonus balance.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">11.6. Refer-A-Friend (RAF) Bonus</h4>
            <p className="mb-2">Vellumtrade offers the following Refer-A-Friend (RAF) bonus:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>A new client is referred to Vellumtrade by a current client</li>
              <li>The current client must have an active account and have conducted at least US$ 200 worth of trades on the Vellumtrade site in order to be eligible. A client whose account has been blocked, closed or self-excluded from promotional offers at the time of the referral is not eligible for the RAF bonus.</li>
              <li>Only new clients who have never before opened accounts on the Vellumtrade site are eligible</li>
              <li>When the new client opens a Vellumtrade account and deposits a minimum of $200, both the new client who made the referral will receive a bonus of US$ 50</li>
              <li>This bonus can only be redeemed after both the old and new clients have traded a minimum of 30 times the bonus amount on the Vellumtrade site</li>
              <li>Vellumtrade has the sole discretion to determine the allocation of supplementary bonuses and other benefits</li>
              <li>The 50 (USD) RAF bonus will be credited to the user accounts of the current and new clients within two business days after Vellumtrade has approved the new client's membership and initial deposit, in accordance with the terms and conditions laid out in this section</li>
              <li>There is no limit to how many new clients an active client may refer, but you cannot receive more than one RAF bonus for each new client referred by and approved by Vellumtrade</li>
              <li>Vellumtrade will not accept any appeals initiated by the client or by a third party regarding RAF bonuses. All decisions made by Vellumtrade regarding the awarding of an RAF bonus, as well as any conditions related to the bonus, are final and non-negotiable</li>
              <li>All conditions stipulated in the Bonus super-section are applicable to the RAF Bonus as well</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'liability',
      title: '12. Limited Liability',
      content: (
        <div className="space-y-4">
          <p>
            We are committed to ensure continuity of the services on our site. However, we assume no responsibility for any error, omission, deletion, 
            interruption, delay, defect, in operation or transmission, communications line failure, theft or destruction or unauthorized access or 
            alteration of our site or services. We decline responsibility for any problems or technical malfunction of any telephone network or lines, 
            computer online systems, servers or providers, hardware or software, or any technical failure because of technical problems or traffic 
            congestion on the Internet, our site or any service.
          </p>
          <p>
            To the extent permitted by applicable law, in no event shall we be liable for any loss or damage arising from use of our site or services 
            for any content posted on or through our site or services, or the conduct of all users of our site or services, whether online or offline.
          </p>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-red-800 uppercase tracking-wide">
              In no event Vellumtrade or any of its directors, officers, employees or agents shall be liable for any damages whatsoever to you, 
              including, without limitation, indirect, incidental, consequential or punitive damages arising out of or related to the use of our site 
              or the services, including without limitation the quality of the usefulness of information provided through or as part of our site or 
              any investment decision making on the basis of the information, whether the damages were predictable or not and whether or not Vellumtrade 
              has been acquainted with the possibility of such damages. Limitation of liability shall apply to the fullest extent permitted by law and 
              in no event shall Vellumtrade cumulative liability to you exceed the amount of money you transferred or deposited in your account on our 
              site in connection with the transaction giving rise to such liability.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'aml',
      title: '13. AML Procedures',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900">13.1 Prohibited Uses</h4>
          <p>
            It is prohibited to abuse this site for purposes of money laundering. Vellumtrade employs best practice anti-money laundering. Vellumtrade 
            reserves the right to refuse and to terminate any business relationship and to cancel any operation of customers who do not comply with the 
            requirements of anti-money laundering.
          </p>
          
          <h4 className="font-semibold text-lg mt-6 text-gray-900">13.1.1 Online Traders</h4>
          <p>Online traders should provide all information required for registration.</p>
          
          <h4 className="font-semibold text-lg mt-4 text-gray-900">13.1.2 Earnings Distribution</h4>
          <p>
            The earnings will be paid to the person who first registered for an account online.
          </p>
          
          <h4 className="font-semibold text-lg mt-4 text-gray-900">13.1.3 Wire Transfers</h4>
          <p>
            When a customer maintains an account through wire transfers, the gains will be distributed to the sole owner of the originating bank account. 
            When you make deposits in this way, it is the responsibility of the investor to ensure that the trader's account number and the registered 
            name of the account owner accompany every transfer to Vellumtrade.
          </p>
          
          <h4 className="font-semibold text-lg mt-4 text-gray-900">13.1.4 Credit/Debit Card Deposits</h4>
          <p>
            When a deposit is made using a credit card or debit card, the winnings will be distributed solely to the person whose name appears on the 
            card used to make the deposit and will not be reimbursed on another card.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <p className="font-semibold mb-2 text-gray-900">13.1.5 Account Verification</p>
            <p>
              Only one account is allowed per person. No gains can be levied on accounts opened under false names or multiple accounts opened by the same person.
            </p>
          </div>
          
          <p>
            From time to time, Vellumtrade may, at its sole discretion, require a customer to provide additional proof of identity such as a notarized 
            copy of passport or other means of identity verification. Vellumtrade may, at its sole discretion, suspend an account until the required 
            proof is provided.
          </p>
        </div>
      ),
    },
    {
      id: 'intellectual-property',
      title: '14. Intellectual Property',
      content: (
        <div className="space-y-4">
          <p>
            All content, including every trademark, service mark, trade name, logo and icon are the property of Vellumtrade or its affiliates or agents 
            and are protected by law and international treaties and provisions relating to copyright. You agree not to remove copyright notices or other 
            indications of protected intellectual property rights of any material you print or download from our site. You will not obtain intellectual 
            property rights, or any right or license to use such material, other than those set forth herein.
          </p>
          <p>
            Images displayed on our site are property of Vellumtrade. You agree not to upload, post, distribute or reproduce any information, software 
            or other material protected by copyright or any other intellectual property right (including rights of publicity and privacy) without first 
            obtaining permission from the copyright owner and the prior written consent of Vellumtrade.
          </p>
        </div>
      ),
    },
    {
      id: 'indemnification',
      title: '15. Indemnification',
      content: (
        <div className="space-y-4">
          <p>
            You agree to defend and indemnify our company and its officers, directors, employees and agents and to hold them harmless from and against 
            any and all claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney's fees and costs, arising 
            out of or in any way connected with your access to or use of our site or services; your violation of any of the terms in this agreement; 
            or your breach of any applicable laws or regulations.
          </p>
        </div>
      ),
    },
    {
      id: 'termination',
      title: '16. Term and Termination',
      content: (
        <div className="space-y-4">
          <p>
            The term of the Agreement shall be unlimited however, our company will be allowed to terminate this agreement at any time by notice to you. 
            As of termination, you shall not be able to carry out new transactions.
          </p>
        </div>
      ),
    },
    {
      id: 'general-clause',
      title: '17. General Clause',
      content: (
        <div className="space-y-4">
          <p>
            Our company (Vellumtrade) will not be liable in any way to any persons in the event of force majeure, or for the act of any government or 
            legal authority. This agreement shall be governed by and interpreted in accordance with the laws of London excluding that body of law pertaining 
            to the conflict of laws. Any legal action or proceeding arising under this agreement will be brought exclusively in courts located in London 
            and the parties hereby irrevocably consent to the personal jurisdiction and venue therein.
          </p>
          <p>
            In the event that any provision in this agreement is held to be invalid or unenforceable, the remaining provisions will remain in full force 
            and effect. The failure of a party to enforce any right or provision of this agreement will not be deemed a waiver of such right or provision.
          </p>
          <p>
            Our company may assign this Agreement or any rights and/or obligations without your consent. Our company may amend the terms of this Agreement 
            from time to time by posting the amended terms on our site. You are responsible for checking whether the agreement was amended. Any amendment 
            shall come into force as of the day it was published on our site. If you do not agree to be bound by the changes to the terms and conditions 
            of this agreement, do not use or access our services, and inform us in writing immediately.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-navy-50">
      
             {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-50/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2">
               {/* Logo Icon */}
  <img 
    src="/logo1.png" 
    alt="VELLUMTRADE" 
    className="h-8 w-auto object-contain"
  />
  {/* Logo Text */}
  <div className="flex items-center">
    <span className="text-amber-500 font-bold text-xl tracking-wide">VELLUM</span>
    <span className="text-blue-600 font-bold text-xl tracking-wide">TRADE</span>
  </div>
</NavLink>

            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="/about-us" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a>
              <a href="/terms" className="text-blue-600 font-medium">Terms</a>
            </div>

            <div className="flex items-center gap-4">
              <NavLink to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Login
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Live Market Ticker - Matches Landing Page */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-blue-900 border-b border-blue-800 py-2">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <div className="flex items-center animate-marquee whitespace-nowrap">
              {[...coins, ...coins].map((coin, index) => (
                <div key={`${coin.id}-${index}`} className="flex items-center gap-4 px-6 flex-shrink-0">
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-white font-medium">{coin.name}</span>
                  <span className="text-blue-300">({coin.symbol.toUpperCase()})</span>
                  <span className="text-white font-semibold">${coin.current_price?.toLocaleString()}</span>
                  <span className={`${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'} font-medium`}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Preserved Content & Updated Styling */}
      <main 
        className={`px-4 py-8 pt-32 max-w-4xl mx-auto transition-all duration-700 ease-out transform ${
          showContent ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
        }`}
      >
        <section className="mb-12">
          {/* Terms Title with Underline */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-wide text-gray-900 mb-2">TERMS OF SERVICE</h1>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-12">
            {termsSections.map((section) => (
              <section 
                key={section.id}
                id={section.id}
                className="scroll-mt-32"
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-950 border-b pb-3">
                  {section.title}
                </h2>
                <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>

      {/* Footer - UPDATED with Payment Icons and Comodo Secure */}
      <footer className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <NavLink to="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo1.png" 
                    alt="Vellumtrade" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Vellumtrade</span>
              </NavLink>
              <p className="text-blue-100 text-sm mb-6">
                Your trusted partner in cryptocurrency and forex trading. Secure, reliable, and profitable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Explore</h4>
              <ul className="space-y-3">
                {footerLinks.explore.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Subscribe</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-navy-50/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Methods & Copyright Section */}
        <div className="border-t border-blue-500 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Copyright and Comodo Secure */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <p className="text-white text-sm">
                  Copyright ©️ 2023 VELLUMTRADE. All rights reserved.
                </p>
                {/* Comodo Secure Badge */}
                <div className="flex items-center gap-1 bg-navy-50 rounded-full px-2 py-1">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-green-600 font-bold text-xs">COMODO</span>
                  <span className="text-gray-600 font-bold text-xs">SECURE</span>
                </div>
              </div>
            </div>

            {/* Payment Method Icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {/* Visa */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                  <path d="M17.68 1.5L15.5 14.5H18.9L21.08 1.5H17.68Z" fill="#1A1F71"/>
                  <path d="M30.5 1.5C29.5 1.1 28 0.8 26.2 0.8C22.2 0.8 19.3 3 19.3 6.2C19.3 8.6 21.4 9.9 22.9 10.7C24.5 11.5 25 12 25 12.6C25 13.5 23.9 13.9 22.9 13.9C21.4 13.9 20.5 13.6 19.3 13.1L18.8 12.9L18.3 15.8C19.5 16.3 21.3 16.6 23.2 16.6C27.4 16.6 30.2 14.4 30.2 11C30.2 9.1 29 7.8 26.7 6.8C25.3 6.2 24.4 5.7 24.4 5.1C24.4 4.6 25 4 26.3 4C27.5 4 28.4 4.2 29.2 4.5L29.6 4.7L30.1 1.9L30.5 1.5Z" fill="#1A1F71"/>
                  <path d="M35.5 1.5H32.5C31.7 1.5 31.1 1.7 30.7 2.6L24.5 14.5H28.4L29.2 12.5H34.3L34.8 14.5H38.2L35.5 1.5Z" fill="#1A1F71"/>
                  <path d="M12.5 1.5L8.5 9.8L8.1 8C7.3 5.6 5.2 3 2.5 1.6L6.1 14.5H10.1L15.9 1.5H12.5Z" fill="#1A1F71"/>
                  <path d="M6.5 1.5H0.8L0.7 1.7C5.3 2.8 8.5 5.8 9.8 9.2L8.9 2.6C8.7 1.7 8.2 1.5 7.4 1.5H6.5Z" fill="#F7B600"/>
                </svg>
              </div>
              
              {/* MasterCard */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 30" fill="none">
                  <circle cx="15" cy="15" r="15" fill="#EB001B"/>
                  <circle cx="33" cy="15" r="15" fill="#F79E1B"/>
                  <path d="M24 5C27.5 7.5 29.5 11 29.5 15C29.5 19 27.5 22.5 24 25C20.5 22.5 18.5 19 18.5 15C18.5 11 20.5 7.5 24 5Z" fill="#FF5F00"/>
                </svg>
              </div>

              {/* Maestro */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 30" fill="none">
                  <circle cx="15" cy="15" r="15" fill="#0099DF"/>
                  <circle cx="33" cy="15" r="15" fill="#6C6BBD"/>
                  <path d="M24 5C27.5 7.5 29.5 11 29.5 15C29.5 19 27.5 22.5 24 25C20.5 22.5 18.5 19 18.5 15C18.5 11 20.5 7.5 24 5Z" fill="#FF5F00"/>
                </svg>
              </div>

              {/* JCB */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" fill="#0066B3"/>
                  <rect x="18" y="2" width="12" height="12" rx="2" fill="#00A650"/>
                  <rect x="34" y="2" width="12" height="12" rx="2" fill="#FF0000"/>
                  <text x="6" y="11" fontSize="8" fill="white" fontWeight="bold">J</text>
                  <text x="22" y="11" fontSize="8" fill="white" fontWeight="bold">C</text>
                  <text x="38" y="11" fontSize="8" fill="white" fontWeight="bold">B</text>
                </svg>
              </div>

              {/* Skrill */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <span className="text-purple-700 font-bold text-sm">Skrill</span>
              </div>

              {/* Visa Electron */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                  <path d="M17.68 1.5L15.5 14.5H18.9L21.08 1.5H17.68Z" fill="#1A1F71"/>
                  <path d="M30.5 1.5C29.5 1.1 28 0.8 26.2 0.8C22.2 0.8 19.3 3 19.3 6.2C19.3 8.6 21.4 9.9 22.9 10.7C24.5 11.5 25 12 25 12.6C25 13.5 23.9 13.9 22.9 13.9C21.4 13.9 20.5 13.6 19.3 13.1L18.8 12.9L18.3 15.8C19.5 16.3 21.3 16.6 23.2 16.6C27.4 16.6 30.2 14.4 30.2 11C30.2 9.1 29 7.8 26.7 6.8C25.3 6.2 24.4 5.7 24.4 5.1C24.4 4.6 25 4 26.3 4C27.5 4 28.4 4.2 29.2 4.5L29.6 4.7L30.1 1.9L30.5 1.5Z" fill="#1A1F71"/>
                  <path d="M35.5 1.5H32.5C31.7 1.5 31.1 1.7 30.7 2.6L24.5 14.5H28.4L29.2 12.5H34.3L34.8 14.5H38.2L35.5 1.5Z" fill="#1A1F71"/>
                  <path d="M12.5 1.5L8.5 9.8L8.1 8C7.3 5.6 5.2 3 2.5 1.6L6.1 14.5H10.1L15.9 1.5H12.5Z" fill="#1A1F71"/>
                  <path d="M6.5 1.5H0.8L0.7 1.7C5.3 2.8 8.5 5.8 9.8 9.2L8.9 2.6C8.7 1.7 8.2 1.5 7.4 1.5H6.5Z" fill="#00A1FF"/>
                </svg>
              </div>

              {/* Western Union */}
              <div className="bg-yellow-400 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-black font-bold text-xs text-center leading-tight">WESTERN<br/>UNION</span>
              </div>

              {/* Wire Transfer */}
              <div className="bg-blue-800 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-white font-bold text-xs text-center">wire<br/>transfer</span>
              </div>

              {/* MoneyGram */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-red-600 font-bold text-xs">MoneyGram</span>
              </div>

              {/* Neteller */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-green-600 font-bold text-sm">NETELLER</span>
              </div>
            </div>

            {/* GetButton reference */}
            <div className="flex items-center justify-center gap-2 text-blue-200 text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>GetButton</span>
            </div>
          </div>
        </div>
      </footer>

     {/* Replace the current WhatsApp & Chat Buttons div with this */}
<div className="relative bg-blue-600">
  <div className="absolute -top-16 right-4 flex flex-col gap-3">
    <WhatsAppButton />
    <ChatButton />
  </div>
  {/* The buttons need a container with height to prevent covering footer */}
  <div className="h-20"></div>
    </div>
      
     
     
    </div>
  );
};

export default TermsAndConditions;