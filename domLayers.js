function isRoot(e){
    // Root element of the document (<html>).
    return e.tagName.toLowerCase()=="html";

}

function hasZIndex(e){
    return e.style.zIndex && e.style.zIndex != "auto"
}

function hasPositionRelativeOrAbsolute(e){
    // Element with a position value absolute or relative and z-index value other than auto.
    return !!(e.style.position=="relative" || e.style.position=="absolute");
}

function hasPositionFixedOrSticky(e){
    // Element with a position value fixed or sticky (sticky for all mobile browsers, but not older desktop).
    return !!(e.style.position=="fixed" || e.style.position=="sticky");
}


function isChildOfFlexContainer(e){
    // Element that is a child of a flex container, with z-index value other than auto.
    let p = e.parentElement;
    return (p && p.style && (typeof p.style.display==="string") 
        && (p.style.display.toLowerCase()=="flex" || p.style.display.toLowerCase()=="inline-flex"));
}

function isChildOfGridContainer(e){
    // Element that is a child of a grid container, with z-index value other than auto.
    let p = e.parentElement;
    return (p && p.style && (typeof p.style.display==="string") 
        && (p.style.display.toLowerCase()=="grid" || p.style.display.toLowerCase()=="inline-grid"));
}
let fs = function(e){return hasPositionFixedOrSticky(e) && hasZIndex(e)};
let ra = function(e){return hasPositionRelativeOrAbsolute(e) && hasZIndex(e)};
let cof = function(e){return isChildOfFlexContainer(e) && hasZIndex(e)};
let cog = function(e){return isChildOfGridContainer(e) && hasZIndex(e)};

function isTranslucent(e){
    // Element with a opacity value less than 1 (See the specification for opacity).
    return e.style.opacity && (+e.style.opacity < 1);    
}

function hasMixBlendMode(e){
    // Element with a mix-blend-mode value other than normal.
    return e.style.mixBlendMode && e.style.mixBlendMode != "normal";
}

function hasSpecialProperty(e){
    // Element with any of the following properties with value other than none:
    //     transform
    //     filter
    //     perspective
    //     clip-path
    //     mask / mask-image / mask-border
    let props = ["transform","filter","perspective","clipPath","mask",
        "maskImage","maskBorder"];
    for (p of props){
        if (!e[p]){
            continue;
        }
        if (e[p] != "normal") {
            return true;
        }
    }
    return false;
}

function hasIsolationValue(e){
    // Element with a isolation value isolate.
    return e.style.isolate && e.style.isolate == "isolate";
}

function hasTouchScrolling(e){
    // Element with a -webkit-overflow-scrolling value touch.
    return e.style.webkitOverflowScrolling && e.style.webkitOverflowScrolling == "touch";
}

function willChangeToCreateStackingContext(e){
    // Element with a will-change value specifying any property that would create a stacking context on non-initial value (see this post).
    return e.style.willChange;
}

function hasContainValue(e){
    // Element with a contain value of layout, or paint, or a composite value that includes either of them (i.e. contain: strict, contain: content).
    return e.style.contain && (
    e.style.contain=="layout" ||
    e.style.contain == "paint" ||
    e.style.contain == "strict" ||
    e.style.contain == "content");
}

function isAStackContextCreator(elem,getAllReasons=true){
    let funcs = [isRoot,fs,ra,isChildOfFlexContainer,isChildOfGridContainer,isTranslucent,
        hasMixBlendMode,hasSpecialProperty,hasIsolationValue,hasTouchScrolling,
        willChangeToCreateStackingContext,hasContainValue];
    let isAStackContextCreator = false;
    let reasons = "";
    for (let f of funcs){
        if (f(elem)){
            isAStackContextCreator = true;
            reasons+=f.name;
            if (!getAllReasons){
                break;
            }
        }
    }
    return {elem,isAStackContextCreator,reasons};
}

allElems = [...document.body.querySelectorAll("*")];
scCreatorsIncludingSvg = allElems.map(e=>isAStackContextCreator(e)).filter(e=>e.isAStackContextCreator);
scCreators = scCreatorsIncludingSvg.filter(e=>!
    ["svg","path","g","defs","polygon","rect"].includes(e.elem.tagName.toLowerCase()));





