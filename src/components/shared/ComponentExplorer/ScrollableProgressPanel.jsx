import { useState, useEffect, Suspense } from "react";
import CloseableDiv from "../ClosableDiv/ClosableDiv";
import ProgressPanelList from "./ProgressPaneList/ProgressPanelList";
import StickyComponent from "./StickyComponent";
import "./scrollable-progress-panel.css";

const ScrollableProgressPanel = ({
    isOpen = true,
    onClose,
    items = [],
    parentId = "contentPane_leftPane",
    headerId = "contentPane_leftPane_header",
    height = "100%",
    className = "",
    onComponentLoad // callback to send loaded component back to parent
}) => {
    const [activeItem, setActiveItem] = useState("");
    const [currentComponent, setCurrentComponent] = useState(null);

    // Load last clicked item on mount
    useEffect(() => {
        const storedItem = localStorage.getItem("lastClickedItem");
        if (storedItem) {
            setActiveItem(storedItem);
            //loadComponent(storedItem);
        }
    }, []);

    //  const loadComponent = async (name) => {
    //   if (componentMap[name]) {
    //     const module = await componentMap[name]();
    //     return module.default;
    //   } else {
    //     throw new Error(`Component ${name} not found`);
    //   }
    // };

    const handleItemClick = (item) => {
        if (!item.load) {
            console.error(`No load function defined for component: ${item.componentName}`);
            return;
        }
        localStorage.setItem("lastClickedItem", item.componentName);
        item.load().then((module) => {
            const Component = module.default;
            setCurrentComponent(<Component />);
            if (onComponentLoad) onComponentLoad(<Component />);
        });
    };



    return (
        <>

            <CloseableDiv isOpen={isOpen} onClose={onClose}>
                <div
                    className={`scrollable-progress-panel ${className}`}
                    style={{ height }}
                >
                    <ProgressPanelList
                        items={items.map((it) => ({
                            ...it,
                            active: activeItem === it.componentName,
                            onClick: () => handleItemClick(it)
                        }))}
                    />
                    <hr></hr>
                    <br />
                    <div>ssss</div>

                    {<StickyComponent
                        mode="scroll-follow"
                        parentId={parentId} childId={headerId}
                        offset={0}
                    >
                        Scroll Follow Content
                    </StickyComponent>}



                    {/* Optional embedded preview or render space */}
                    {/* {currentComponent && (
          <div style={{ marginTop: "1rem" }}>
            <Suspense fallback={<div>Loading...</div>}>
              {currentComponent}
            </Suspense>
          </div>
        )} */}
                </div>
            </CloseableDiv>
        </>
    );
};

export default ScrollableProgressPanel;