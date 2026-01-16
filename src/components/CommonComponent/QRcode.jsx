/** @format */
import "./QRcode.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/images/img1.png";
import img1 from "../../assets/images/qrcode.png";
import { JObsmodal } from "../Modals/Modals";
import { IoBag } from "react-icons/io5";
const QRcode = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>

{/* <div className="flex justify-between items-center"> */}
       {/* <div className="mt-5 font-bold flex justify-center items-center">
         <span 
  style={{ fontWeight: 'bold', cursor: 'pointer' }} 
  onClick={() => navigate('/')}
>
  Product 
</span>

          <span className="mx-2">/</span>
          <span className="cursor-pointer font-bold"
           style={{ fontWeight: 'bold', cursor: 'pointer' }} 
          
          onClick={() => setIsOpen(true)}>
            Service
          </span>
        </div> */}
      <div className="qrcode-container flex items-center justify-center">
       
        <div className="qrcode-left">
      <IoBag size={48} color="#e25845" />
      
              </div>
   <div className="qrcode-center">
  <p>Scan to download the app</p>
  <p>We love our neighbors, we help to build a better community, this is what we do</p>
</div>


    <div className="qrcode-right">
  <img src={img1} alt="" className="w-[100px] h-[100px]" />
</div>

      </div>

      {/* </div> */}
      <JObsmodal show={isOpen} onHide={() => setIsOpen(false)} />
    </>
  );
};

export default QRcode;