import React, { useState, useEffect, Suspense } from 'react'
import "./TwoColumnScrollableContainer.css"
import StickyComponent from './StickyComponent'
import CloseableDiv from '../ClosableDiv/ClosableDiv';
import { progressItems } from './progress.items.js';
import ProgressPanelList from './ProgressPaneList/ProgressPanelList';
import ScrollableProgressPanel from './ScrollableProgressPanel.jsx';
const TwoColumnScrollableContainer = () => {
    const [currentComponent, setCurrentComponent] = useState(null);
    const [isOpen, setIsOpen] = useState(true); // panel expanded or collapsed

    const handleToggle = () => setIsOpen(!isOpen);

    // Sample icons you can replace with your own components or SVGs
    function CloseIcon(props) {
        return (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: "1.3rem", height: "1.3rem" }} {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        );
    }

    function OpenIcon(props) {
        return (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: "1.5rem", height: "1.5rem" }} {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        );
    }

    return (
        <div className="two-column-container-wrapper">
            <div className="two-column-container flex_column">
                <div className="contentWrapper">
                    <div className="contentPane">
                        {/* LEFT PANE */}
                        <div className={`contentPane_leftPaneWrapper ${isOpen ? "expanded" : "collapsed"}`}>                           
                            <div className="contentPane_leftPane" id="contentPane_leftPane">

                                {/* Header - Always visible */}
                                <div className="contentPane_leftPane_header" id="contentPane_leftPane_header" style={{ display: "flex", justifyContent: isOpen ? "flex-start" : "center" }}>
                                    <button
                                        onClick={handleToggle}
                                        title={isOpen ? "Close" : "Open"}
                                        className="button_root button_icon leftPane_header_button"
                                        style={{ color: "rgb(8, 18, 41)", padding: isOpen ? "0.5rem 1rem" : "0.5rem", borderRadius: "0.4rem" }}
                                    >
                                        {isOpen ? (
                                            <>
                                                <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: "1.3rem", height: "1.3rem" }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span style={{ marginLeft: "0.5rem" }}>Close</span>
                                            </>
                                        ) : (
                                            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: "1.5rem", height: "1.5rem" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Scrollable content only if open */}
                                {isOpen && (
                                    <ScrollableProgressPanel
                                        isOpen={isOpen}
                                        onClose={() => setIsOpen(false)}
                                        items={progressItems}
                                        parentId="contentPane_leftPane"
                                        headerId="contentPane_leftPane_header"
                                        onComponentLoad={(component) => setCurrentComponent(component)}
                                    />
                                )}

                            </div>
                        </div>

                        {/* RIGHT PANE */}
                        <div className="contentPane_rightPanelWrapper right-div">
                            {currentComponent || <p>Select an item...</p>}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoColumnScrollableContainer;