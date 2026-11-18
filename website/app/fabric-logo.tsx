const BASE_PATH = import.meta.env.BASE_URL;

export default function FabricLogo() {
  return (
    <span className="fabric-logo">
      <img className="fabric-symbol" src={`${BASE_PATH}fabric-symbol.png`} alt="" width={256} height={210} />
      <img className="fabric-wordmark" src={`${BASE_PATH}fabric-wordmark.png`} alt="Fabric" width={640} height={131} />
    </span>
  );
}
