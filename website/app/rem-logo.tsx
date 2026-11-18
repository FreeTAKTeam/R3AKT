const BASE_PATH = import.meta.env.BASE_URL;

export default function RemLogo() {
  return <img className="rem-brand-logo" src={`${BASE_PATH}rem-brand-logo.png`} alt="REM" width={768} height={270} />;
}
