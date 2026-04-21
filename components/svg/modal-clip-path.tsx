const ModalClipPath = () => (
  <svg className="block" height={0} width={0}>
    <clipPath clipPathUnits="objectBoundingBox" id="modal-cut">
      <path d="M0.05,0 H0.85 a0.02,0.02,0,0,1,0.015,0.005 l0.13,0.13 A0.02,0.02,0,0,1,1,0.15 V0.95 c0,0.027,-0.022,0.05,-0.05,0.05 H0.05 c-0.028,0,-0.05,-0.023,-0.05,-0.05 V0.05 C0,0.023,0.022,0,0.05,0" />
    </clipPath>
  </svg>
);

export default ModalClipPath;
