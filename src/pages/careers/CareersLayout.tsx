import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCareersContext } from "../../apiservice/recruitment-service";
import { CareersContext } from "../../components/admincomponents/Recruitment/recruitment.types";

/** Loads a business's public careers info (name + branches); null while loading. */
export const useCareersContext = (businessId: string) => {
  const [context, setContext] = useState<CareersContext | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setContext(null);
    setNotFound(false);
    getCareersContext(businessId)
      .then(setContext)
      .catch(() => setNotFound(true));
  }, [businessId]);

  return { context, notFound };
};

/** Public shell for one business's careers pages (no sidebar, no login). */
export default function CareersLayout({
  businessId,
  businessName,
  children,
}: {
  businessId: string;
  businessName?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = businessName ? `Careers at ${businessName}` : "Careers";
  }, [businessName]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <Link to={`/careers/${businessId}`} className="flex items-center gap-3">
            <img
              src={process.env.REACT_APP_LOGO_Image || "/images/logo_red.png"}
              alt=""
              className="h-10 w-auto rounded-lg"
            />
            <span className="text-lg font-semibold text-slate-900">
              {businessName ? `${businessName} Careers` : "Careers"}
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
