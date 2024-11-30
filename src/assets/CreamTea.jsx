import React, { useState } from 'react';

const CreamTea = () => {
    const [isChecked, setIsChecked] = useState(false);

    const toggleHotspot = () => {
        setIsChecked(!isChecked);
    };

    const handleLabelClick = () => {
        window.location.href = "https://mooneyworldax.com/product/mooneyworld-all-access-cream-tee/";
    };

    return (
        <div className="image-indicators">
            <input 
                type="checkbox" 
                className="point" 
                id="point-1" 
                name="point" 
                value="1"
                checked={isChecked} 
                onChange={toggleHotspot}
            />
            <label htmlFor="point-1" id="label-1" onClick={handleLabelClick}>
                <span>
                    <span></span>
                </span>
            </label>
            <style>
                {`
                    .image-indicators {
                        position: relative;
                        width: 400px;
                        height: 300px;
                        font-size: 0;
                        margin: auto;
                    }

                    .image-indicators label {
                        display: flex;
                        position: absolute;
                        cursor: pointer;
                        transition-property: opacity;
                        transition-duration: 300ms;
                        transition: opacity 0.3s ease-out;
                    }

                    .image-indicators > label > span {
                        background-color: white; /* Changed color to white */
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        transform: scale(1);
                    }

                    .image-indicators > label > span > span {
                        display: inline-block;
                        vertical-align: 20px;
                        background-color: rgba(255, 255, 255, 1); /* Changed inner span color to white */
                        width: 10px;
                        height: 10px;
                        transform: scale(0);
                        border-radius: 50%;
                        animation: scaleGrow 3s cubic-bezier(0, 0.2, 0.8, 1) infinite;
                        animation-play-state: running;
                    }

                    @keyframes scaleGrow {
                        from {
                            transform: scale(0);
                        }
                        to {
                            transform: scale(3);
                            opacity: 0;
                        }
                    }

                    .point {
                        position: absolute;
                        width: 15px;
                        height: 15px;
                        cursor: pointer;
                        opacity: 0;
                    }
                `}
            </style>
        </div>
    );
};

export default CreamTea;
