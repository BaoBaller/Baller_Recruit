import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const { language, t } = useLanguage();

  const quickLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.jobs, href: "#jobs" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <footer id="contact" className="bg-sidebar border-t" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CareerHub</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {language === "vi"
                ? "Kết nối nhân tài với cơ hội việc làm tuyệt vời. Xây dựng sự nghiệp của bạn cùng chúng tôi."
                : "Connecting talents with great job opportunities. Build your career with us."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.href.slice(1)}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.footer.contact}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 shrink-0" />
                <span>contact@careerhub.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  {language === "vi"
                    ? "123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam"
                    : "123 ABC Street, District 1, Ho Chi Minh City, Vietnam"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright} © {new Date().getFullYear()} CareerHub.{" "}
            {t.footer.allRightsReserved}.
          </p>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
