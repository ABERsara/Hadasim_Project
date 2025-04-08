const PopUp = ({ close, width, children }) => (
    <div className="popup">
      <div className="popup-wrapper animated" style={{ width: width }}>
        {close ? <div onClick={close} className="close-popup">
        </div> : null}
        <div className='children-popup'>{children}</div>
      </div>
    </div>
  );
  export default PopUp