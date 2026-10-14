import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import ArrowScroll from "../components/ArrowScroll";
import { useGlobalContext } from "./GlobalProvider";

const emptyContext = {
  registerScrollRef: () => {},
  unregisterScrollRef: () => {},
  updateScrollOffset: () => {},
};
const ScrollToTopContext = createContext(emptyContext);

export function ScrollToTopProvider({ children }) {
  const { modalVisible } = useGlobalContext();
  const registeredScrollRefs = useRef([]);
  const activeScrollRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const registerScrollRef = useCallback((scrollRef) => {
    registeredScrollRefs.current = registeredScrollRefs.current.filter((item) => item !== scrollRef);
    registeredScrollRefs.current.push(scrollRef);
    activeScrollRef.current = scrollRef;
    setIsVisible(false);
  }, []);

  const unregisterScrollRef = useCallback((scrollRef) => {
    registeredScrollRefs.current = registeredScrollRefs.current.filter((item) => item !== scrollRef);
    activeScrollRef.current = registeredScrollRefs.current[registeredScrollRefs.current.length - 1] || null;
    setIsVisible(false);
  }, []);

  const updateScrollOffset = useCallback((scrollRef, offset) => {
    if (!registeredScrollRefs.current.includes(scrollRef)) return;
    activeScrollRef.current = scrollRef;
    setIsVisible(offset > 300);
  }, []);

  const scrollToTop = useCallback(() => {
    const scrollable = activeScrollRef.current?.current;
    if (typeof scrollable?.scrollToOffset === "function") {
      scrollable.scrollToOffset({ offset: 0, animated: true });
    } else if (typeof scrollable?.scrollTo === "function") {
      scrollable.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      scrollable?.scrollToIndex?.({ index: 0, animated: true });
    }
  }, []);

  const value = useMemo(
    () => ({ registerScrollRef, unregisterScrollRef, updateScrollOffset }),
    [registerScrollRef, unregisterScrollRef, updateScrollOffset]
  );

  return (
    <ScrollToTopContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        {isVisible && !modalVisible && <ArrowScroll scrollToTop={scrollToTop} />}
      </View>
    </ScrollToTopContext.Provider>
  );
}

export function useScrollToTop(scrollRef) {
  const context = useContext(ScrollToTopContext);
  const { registerScrollRef, unregisterScrollRef, updateScrollOffset } = context;

  useFocusEffect(
    useCallback(() => {
      registerScrollRef(scrollRef);
      return () => unregisterScrollRef(scrollRef);
    }, [registerScrollRef, unregisterScrollRef, scrollRef])
  );

  return useCallback((event) => {
    updateScrollOffset(scrollRef, event.nativeEvent.contentOffset.y);
  }, [scrollRef, updateScrollOffset]);
}
