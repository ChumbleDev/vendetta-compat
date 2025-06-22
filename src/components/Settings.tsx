import { FormDivider, FormRow, FormSection, FormSwitch, FormText, FormInput } from 'enmity/components';
import { Constants, React, StyleSheet, Toasts } from 'enmity/metro/common';
import { get, set } from 'enmity/api/settings'
import { getIDByName } from 'enmity/api/assets';
import { reload } from 'enmity/api/native';

interface CompatConfig {
    enabled: boolean;
    customURL?: string;
    useCustomURL: boolean;
    lastLoaded?: number;
    version?: string;
}

type CompatLayer = 'bunny' | 'vendetta' | 'revenge';

const LAYER_INFO = {
    bunny: {
        name: "Bunny",
        description: "A Discord mobile modification focused on plugins and themes",
        defaultURL: "http://localhost:4040/bunny.js",
        icon: "ic_rabbit_24px",
        color: "#FF6B6B"
    },
    vendetta: {
        name: "Vendetta", 
        description: "A Discord mobile client modification with powerful features",
        defaultURL: "http://localhost:4040/vendetta.js",
        icon: "ic_code_24px",
        color: "#8B5CF6"
    },
    revenge: {
        name: "Revenge",
        description: "A feature-rich Discord mobile modification",
        defaultURL: "http://localhost:4040/revenge.js", 
        icon: "ic_sword_24px",
        color: "#EF4444"
    }
};

export default ({ Manifest }) => {
    // State for each compatibility layer
    const [bunnyConfig, setBunnyConfig] = React.useState(get(Manifest.name, 'bunnyConfig', {
        enabled: true,
        useCustomURL: false,
        customURL: LAYER_INFO.bunny.defaultURL
    }) as CompatConfig);

    const [vendettaConfig, setVendettaConfig] = React.useState(get(Manifest.name, 'vendettaConfig', {
        enabled: false,
        useCustomURL: false,
        customURL: LAYER_INFO.vendetta.defaultURL
    }) as CompatConfig);

    const [revengeConfig, setRevengeConfig] = React.useState(get(Manifest.name, 'revengeConfig', {
        enabled: false,
        useCustomURL: false,
        customURL: LAYER_INFO.revenge.defaultURL
    }) as CompatConfig);

    const configs = { bunny: bunnyConfig, vendetta: vendettaConfig, revenge: revengeConfig };
    const setters = { bunny: setBunnyConfig, vendetta: setVendettaConfig, revenge: setRevengeConfig };

    const styles = StyleSheet.createThemedStyleSheet({
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        enabledIcon: {
            color: Constants.ThemeColorMap.TEXT_POSITIVE
        },
        disabledIcon: {
            color: Constants.ThemeColorMap.TEXT_MUTED
        },
        sectionTitle: {
            color: StyleSheet.ThemeColorMap.HEADER_PRIMARY,
            fontFamily: Constants.Fonts.DISPLAY_BOLD,
            fontSize: 16,
            marginBottom: 4
        },
        info: {
            color: StyleSheet.ThemeColorMap.HEADER_SECONDARY,
            fontFamily: Constants.Fonts.PRIMARY_NORMAL,
            fontSize: 12,
            marginTop: 4,
            marginBottom: 8
        },
        versionText: {
            color: StyleSheet.ThemeColorMap.TEXT_MUTED,
            fontFamily: Constants.Fonts.PRIMARY_NORMAL,
            fontSize: 11,
            fontStyle: 'italic'
        },
        layerSection: {
            marginVertical: 8
        }
    });

    const updateConfig = (layer: CompatLayer, updates: Partial<CompatConfig>) => {
        const setter = setters[layer];
        setter((prev: CompatConfig) => {
            const newConfig = { ...prev, ...updates };
            set(Manifest.name, `${layer}Config`, newConfig);
            return newConfig;
        });
    };

    const renderCompatibilityLayer = (layer: CompatLayer) => {
        const config = configs[layer];
        const info = LAYER_INFO[layer];
        const version = get(Manifest.name, `${layer}Version`, "unknown") as string;
        const lastLoaded = get(Manifest.name, `${layer}Timestamp`, 0) as number;
        const lastLoadedText = lastLoaded ? new Date(lastLoaded).toLocaleString() : "Never";

        return (
            <FormSection key={layer} title={info.name} style={styles.layerSection}>
                <FormText style={styles.info}>{info.description}</FormText>
                
                {/* Enable/Disable Toggle */}
                <FormRow
                    label={`Enable ${info.name}`}
                    subLabel={config.enabled ? "Currently active" : "Currently inactive"}
                    leading={<FormRow.Icon 
                        style={config.enabled ? styles.enabledIcon : styles.disabledIcon} 
                        source={getIDByName(config.enabled ? "ic_check_circle_24px" : "ic_circle_outline_24px")} 
                    />}
                    trailing={<FormSwitch
                        value={config.enabled}
                        onValueChange={(enabled: boolean) => updateConfig(layer, { enabled })}
                    />}
                />

                {config.enabled && (
                    <>
                        {/* Custom URL Toggle */}
                        <FormRow
                            label="Use Custom URL"
                            subLabel="Load from a custom server instead of official builds"
                            leading={<FormRow.Icon style={styles.icon} source={getIDByName("ic_link_24px")} />}
                            trailing={<FormSwitch
                                value={config.useCustomURL}
                                onValueChange={(useCustomURL: boolean) => updateConfig(layer, { useCustomURL })}
                            />}
                        />

                        {/* Custom URL Input */}
                        {config.useCustomURL && (
                            <FormInput
                                value={config.customURL || info.defaultURL}
                                onChangeText={(customURL: string) => updateConfig(layer, { customURL })}
                                placeholder={info.defaultURL}
                                title={`${info.name} Custom URL`}
                            />
                        )}

                        {/* Version and Status Info */}
                        <FormRow
                            label="Version Information"
                            subLabel={`Version: ${version} | Last loaded: ${lastLoadedText}`}
                            leading={<FormRow.Icon style={styles.icon} source={getIDByName("ic_info_24px")} />}
                        />

                        {/* Clear Cache */}
                        <FormRow
                            label={`Clear ${info.name} Cache`}
                            subLabel="Clear cached code and force fresh download"
                            leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_trash_24px')} />}
                            trailing={() => <FormRow.Arrow />}
                            onPress={() => {
                                set(Manifest.name, `${layer}Code`, null);
                                set(Manifest.name, `${layer}Timestamp`, 0);
                                set(Manifest.name, `${layer}Version`, "unknown");
                                
                                Toasts.open({
                                    content: `Cleared ${info.name} cache successfully.`,
                                    source: getIDByName('ic_check_18px')
                                });
                            }}
                        />
                    </>
                )}
            </FormSection>
        );
    };

    return <>
        {/* Header */}
        <FormSection title="Discord Compatibility Layers">
            <FormText style={styles.info}>
                Enable and configure different Discord modification compatibility layers. 
                Each layer provides access to their respective plugins, themes, and features.
            </FormText>
        </FormSection>
        <FormDivider />

        {/* Render each compatibility layer */}
        {(['bunny', 'vendetta', 'revenge'] as CompatLayer[]).map(layer => (
            <React.Fragment key={layer}>
                {renderCompatibilityLayer(layer)}
                <FormDivider />
            </React.Fragment>
        ))}

        {/* Global Settings */}
        <FormSection title="Global Settings">
            <FormRow
                label="Clear All Data"
                subLabel="Clear all cached code, settings, and dialogs for all layers"
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_message_delete')} />}
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    // Clear all layer data
                    (['bunny', 'vendetta', 'revenge'] as CompatLayer[]).forEach(layer => {
                        set(Manifest.name, `${layer}Code`, null);
                        set(Manifest.name, `${layer}Timestamp`, 0);
                        set(Manifest.name, `${layer}Version`, "unknown");
                    });
                    
                    // Clear global settings
                    set(Manifest.name, "shownEnabledDialog", false);

                    Toasts.open({
                        content: "Successfully cleared all stored data for all compatibility layers.",
                        source: getIDByName('ic_check_18px')
                    });
                }}
            />

            <FormRow
                label="Force Reload All"
                subLabel="Reload Discord to apply changes and refresh all compatibility layers"
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_message_retry')} />}
                trailing={() => <FormRow.Arrow />}
                onPress={() => reload()}
            />
        </FormSection>
        <FormDivider />

        {/* Plugin Info */}
        <FormSection title="About">
            <FormText style={styles.info}>
                Version {Manifest.version} by {Manifest.authors.map(author => author.name).join(", ")}
            </FormText>
            <FormText style={styles.versionText}>
                Enhanced with multi-layer support and performance optimizations
            </FormText>
        </FormSection>
    </>;
};