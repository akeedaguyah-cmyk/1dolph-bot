// @ts-nocheck — vendored bot code with known upstream type gaps; see AGENTS.md
import React from 'react';
import { observer } from 'mobx-react-lite';
import { DBOT_TABS } from '@/constants/bot-contents';
import { load, save_types } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import one_dolph_bot_xml from '@/xml/1_dolph_bot.xml';
import { localize } from '@deriv-com/translations';
import './preloaded-bot.scss';

export const ONE_DOLPH_BOT_NAME = "1-Dolph - Oscar's Grind";

// The Blockly workspace is created asynchronously after the app opens, so wait for it briefly.
const waitForWorkspace = (timeout_ms = 10000, interval_ms = 100) =>
    new Promise((resolve, reject) => {
        const started_at = Date.now();
        const check = () => {
            const workspace = window.Blockly?.derivWorkspace;
            if (workspace) return resolve(workspace);
            if (Date.now() - started_at >= timeout_ms) return reject(new Error('Bot Builder workspace not ready'));
            setTimeout(check, interval_ms);
        };
        check();
    });

const PreloadedBot = observer(() => {
    const { dashboard } = useStore();
    const { setActiveTab } = dashboard;
    const [is_loading, setIsLoading] = React.useState(false);

    const handleLoad = async () => {
        if (is_loading) return;
        setIsLoading(true);
        try {
            const workspace = await waitForWorkspace();
            setActiveTab(DBOT_TABS.BOT_BUILDER);
            await load({
                block_string: one_dolph_bot_xml,
                file_name: ONE_DOLPH_BOT_NAME,
                workspace,
                from: save_types.UNSAVED,
                drop_event: null,
                strategy_id: null,
                showIncompatibleStrategyDialog: null,
            });
        } catch (error) {
            /* eslint-disable no-console */
            console.error('Failed to load 1 Dolph Bot:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='preloaded-bot'>
            <button
                type='button'
                className='preloaded-bot__button'
                onClick={handleLoad}
                disabled={is_loading}
                data-testid='dt_load_1_dolph_bot'
            >
                <span className='preloaded-bot__title'>
                    {is_loading ? localize('Loading…') : localize('1 Dolph Bot – Load')}
                </span>
                <span className='preloaded-bot__subtitle'>{localize("Oscar's Grind strategy, ready to run")}</span>
            </button>
        </div>
    );
});

export default PreloadedBot;
