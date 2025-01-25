export interface Message {
    id: string;
    content: string;
    isBot: boolean;
}

export interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface Settings {
    apiKey: string;
    model: string;
}
