function addSwipeEventListener(swipeArea) {
    let startX, startY, endX, endY;
    let isSwiping = false;
    let startTime;
    let isHolding = false;
    function catchHolding(holdTimeout = 0) {
        setTimeout(() => {
            if (isSwiping && !isHolding) {
                console.log("WaitHolding", holdTimeout)
                if (Date.now() - startTime > holdTimeout) {
                    isHolding = true;
                    swipeArea.dispatchEvent(new CustomEvent('startHolding'));
                } else {
                    catchHolding(holdTimeout)
                }
            }
        }, 10);
    }

    swipeArea.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        startX = endX = touch.screenX;
        startY = endY = touch.screenY;
        isSwiping = true;
        startTime = Date.now();

        catchHolding(500);
    });

    swipeArea.addEventListener('touchmove', (event) => {
        if (!isSwiping) return;

        const touch = event.touches[0];
        endX = touch.screenX;
        endY = touch.screenY;
    });

    swipeArea.addEventListener('touchend', () => {
        if (!isSwiping) return;
        const minSwipeDiff = 30;
        const diffX = endX - startX;
        const diffY = endY - startY;

        console.log(diffX, diffY);

        if (isHolding) {
            swipeArea.dispatchEvent(new CustomEvent('stopHolding'));
        }
        if (Math.abs(diffX) > minSwipeDiff || Math.abs(diffY) > minSwipeDiff) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    swipeArea.dispatchEvent(new CustomEvent('swipeRight'));
                } else {
                    swipeArea.dispatchEvent(new CustomEvent('swipeLeft'));
                }
            } else {
                if (diffY > 0) {
                    swipeArea.dispatchEvent(new CustomEvent('swipeDown'));
                } else {
                    swipeArea.dispatchEvent(new CustomEvent('swipeUp'));
                }
            }
        } else {
            if (!isHolding) {
                swipeArea.dispatchEvent(new CustomEvent('touch'));
            }
        }
        isSwiping = false;
        isHolding = false;
    });
}

function pressArrow(direction, keyupTimeout = null) {
    pressKey(`Arrow${direction}`, `Arrow${direction}`, keyupTimeout)
}

function pressKey(key, code, keyupTimeout = null) {
    startPressKey(key, code);

    if (keyupTimeout !== null) {
        setTimeout(() => {
            stopPressKey(key, code);
        }, keyupTimeout);
    }
}

function startPressKey(key, code) {
    let event = new KeyboardEvent('keydown', {
        key: key,
        code: code,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

function stopPressKey(key, code) {
    let event = new KeyboardEvent('keyup', {
        key: key,
        code: code,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

addSwipeEventListener(document);
document.addEventListener("swipeRight", () => pressArrow("Right", 100));
document.addEventListener("swipeLeft", () => pressArrow("Left", 100));
document.addEventListener("swipeDown", () => pressKey("Shift", "ShiftLeft", 100));
document.addEventListener("swipeUp", () => pressArrow("Up", 100));
document.addEventListener("touch", () => pressKey(" ", "Space", 100));
document.addEventListener("startHolding", () => startPressKey("ArrowDown", "ArrowDown"));
document.addEventListener("stopHolding", () => stopPressKey("ArrowDown", "ArrowDown"));

