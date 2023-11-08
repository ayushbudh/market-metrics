import '@testing-library/jest-dom';
(global as any).URL.createObjectURL = vi.fn();
(global as any).HTMLCanvasElement.prototype.getContext = () => {
    return {
        dataTestId: 'custom-element1',
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getContext: vi.fn(),
        toDataURL: vi.fn(),
        getImageData: vi.fn(),
        putImageData: vi.fn()
    };
};